// @ts-nocheck
/// <reference path="globals.d.ts" />

interface PackageDef {
	depends?: string | string[];
	fileName?: string | string[];
	contentType?: string;
	pattern?: string;
	mergeRequests?: boolean;
	[key: string]: any;
}

interface PackagesConfig {
	defaultContentType: string;
	packages?: { [key: string]: PackageDef };
	patterns?: { [key: string]: PatternDef };
	contextPath?: string;
}

interface PatternDef {
	url?: string;
	contentType?: string;
	mergeRequests?: boolean;
	[key: string]: any;
}

interface Request {
	id?: string;
	package: string | string[];
	url: string;
	contentType: string;
	pattern: PatternDef;
}

interface LoadOptions {
	callback?: () => void;
	contentType?: string;
}

let $import: (pkgs: string | string[], options?: (() => void) | LoadOptions | null) => void;
let $load: (urls: string | string[], options?: string | (() => void) | LoadOptions | null) => void;
const $packagesConfig: PackagesConfig = (window as any).$packagesConfig || {};

const CONTEXT_TYPE: { CSS: string; JS: string } = {
	CSS: 'text/css',
	JS: 'text/javascript'
};
$packagesConfig.defaultContentType = $packagesConfig.defaultContentType || CONTEXT_TYPE.JS;

(() => {
	const loadedPackages: { [key: string]: boolean } = {};
	let head: HTMLElement;

	// --- 工具函数 ---
	const findHead = (): void => {
		head = document.getElementsByTagName("head")[0] || document.documentElement;
	};

	const isStyleSheet = (type: string): boolean => type === CONTEXT_TYPE.CSS;
	const isJavaScript = (type: string): boolean => type === CONTEXT_TYPE.JS;

	// --- 网络请求 (彻底移除同步请求和 IE ActiveX) ---
	function fetchContent(url: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const xhr: XMLHttpRequest = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200 || xhr.status === 304) {
						resolve(xhr.responseText);
					} else {
						reject(new Error(`XML request error: ${xhr.statusText} (${xhr.status})`));
					}
				}
			};
			xhr.send(null);
		});
	}

	// --- 依赖解析 ---
	function getNeededs(pkgs: string[]): string[] {
		const packages: { [key: string]: PackageDef } = $packagesConfig.packages || {};
		const needed: string[] = [];
		const visited: Set<string> = new Set(); // 已处理的包，用于去重并切断循环依赖

		function traverse(pkgList: string[]): void {
			pkgList.forEach((pkg: string) => {
				// 必须在递归前标记，否则 A→B→A 之类的循环依赖会导致无限递归
				if (visited.has(pkg)) return;
				visited.add(pkg);
				const def: PackageDef | undefined = packages[pkg];
				if (def?.depends) {
					const deps: string[] = Array.isArray(def.depends) ? def.depends : def.depends.split(",");
					traverse(deps);
				}
				if (!loadedPackages[pkg]) {
					needed.push(pkg); // 后序压栈，保证依赖先于依赖者加载
				}
			});
		}

		traverse(pkgs);
		return needed;
	}

	// --- 请求构建 ---
	function getRequests(pkgs: string[]): Request[] {
		const patterns: { [key: string]: PatternDef } = $packagesConfig.patterns || {};
		const packages: { [key: string]: PackageDef } = $packagesConfig.packages || {};
		const defaultPattern: PatternDef = patterns["default"] || {};

		const tempRequests: Request[] = [];
		const cssRequests: Request[] = [];

		pkgs.forEach((pkg: string) => {
			const def: PackageDef | undefined = packages[pkg];
			if (!def) {
				console.error(`Unknown package: [${pkg}]`);
				return;
			}

			const pattern: PatternDef = patterns[def.pattern as string] || defaultPattern;
			let fileNames: string | string[] = def.fileName || pkg;
			const contentType: string = def.contentType || pattern.contentType || $packagesConfig.defaultContentType;

			if (typeof fileNames === "string") fileNames = fileNames.split(",");

			fileNames.forEach((fileName: string) => {
				if (fileName.includes("(none)")) return;

				const url: string = pattern.url
					? pattern.url.replace(/\$\{fileName}/g, fileName)
					: fileName;

				const request: Request = {
					id: `_package_${pkg}`,
					package: pkg,
					url,
					contentType,
					pattern
				};

				if (isJavaScript(contentType)) {
					tempRequests.push(request);
				} else {
					cssRequests.push(request);
				}
			});
		});

		tempRequests.push(...cssRequests);

		const requests: Request[] = [];
		let mergedRequest: Request | null = null;

		const mergePkgs = (req: Request): void => {
			req.url = req.pattern.url.replace(
				/\$\{fileName}/g,
				(req.package as string[]).join(",").replace(/\//g, "^")
			);
		};

		tempRequests.forEach((req: Request) => {
			if (mergedRequest && mergedRequest.pattern !== req.pattern) {
				mergePkgs(mergedRequest);
				mergedRequest = null;
			}

			if (req.pattern.mergeRequests) {
				if (!mergedRequest) {
					mergedRequest = { ...req } as Request;
					delete (mergedRequest as any).id;
					mergedRequest.package = [];
					requests.push(mergedRequest);
				}
				(mergedRequest.package as string[]).push(req.package as string);
			} else {
				requests.push(req);
			}
		});

		if (mergedRequest) mergePkgs(mergedRequest);

		requests.forEach((req: Request) => {
			if (req.url.startsWith(">")) {
				const base: string = ($packagesConfig.contextPath || "/").replace(/\/$/, "");
				const path: string = req.url.substring(1).replace(/^\//, "");
				req.url = `${base}/${path}`;
			}
		});

		return requests;
	}

	// --- 资源加载核心 ---
	function markRequestLoaded(request: Request): void {
		const pkg: string | string[] = request.package;
		if (Array.isArray(pkg)) {
			pkg.forEach((p: string) => (loadedPackages[p] = true));
		} else {
			loadedPackages[pkg] = true;
		}
	}

	function loadResourceAsync(request: Request): Promise<void> {
		return new Promise((resolve, reject) => {
			findHead();
			let element: HTMLElement;

			if (isStyleSheet(request.contentType)) {
				element = document.createElement("link");
				(element as HTMLLinkElement).rel = "stylesheet";
				(element as HTMLLinkElement).type = request.contentType;
				(element as HTMLLinkElement).href = request.url;
				element.onload = () => resolve();
				element.onerror = () => reject(new Error(`Failed to load CSS: ${request.url}`));
			} else if (isJavaScript(request.contentType)) {
				element = document.createElement("script");
				(element as HTMLScriptElement).type = request.contentType;
				(element as HTMLScriptElement).src = request.url;
				element.onload = () => resolve();
				element.onerror = () => reject(new Error(`Failed to load JS: ${request.url}`));
			} else {
				element = document.createElement("script");
				(element as HTMLScriptElement).type = request.contentType;
				fetchContent(request.url)
					.then((content: string) => {
						(element as HTMLScriptElement).text = content;
						resolve();
					})
					.catch(reject);
			}

			if (request.id) element.id = request.id;
			head.appendChild(element);
			markRequestLoaded(request);
		});
	}

	function loadResourceSync(request: Request): void {
		console.info(`sync load ${request.url}`);
		const attrs: string = request.id ? `id="${request.id}" ` : "";
		if (isStyleSheet(request.contentType)) {
			document.write(`<link ${attrs} rel="stylesheet" type="${request.contentType}" href="${request.url}" />`);
		} else if (isJavaScript(request.contentType)) {
			document.write(`<script ${attrs} type="${request.contentType}" src="${request.url}"></script>`);
		} else {
			console.warn("Synchronous AJAX is deprecated and blocked by modern browsers.");
			findHead();
			const element: HTMLScriptElement = document.createElement("script");
			if (request.id) element.id = request.id;
			element.type = request.contentType;
			fetchContent(request.url).then((content: string) => (element.text = content));
			head.appendChild(element);
		}
		markRequestLoaded(request);
	}

	function loadResources(requests: Request[], callback?: (() => void) | null): void {
		if (!requests.length) {
			if (callback) callback();
			return;
		}

		if (callback) {
			requests.reduce((promise: Promise<void>, request: Request) => {
				return promise.then(() => loadResourceAsync(request));
			}, Promise.resolve()).then(callback).catch((err: Error) => {
				console.error(err.message);
			});
		} else {
			if (/loaded|complete/.test(document.readyState)) {
				console.error("Cannot load script synchronously after the document is ready. Please provide a callback function.");
			} else {
				requests.forEach((req: Request) => loadResourceSync(req));
			}
		}
	}

	// --- 暴露的全局 API ---
	$import = (pkgs: string | string[], options?: (() => void) | LoadOptions | null): void => {
		let callback: (() => void) | undefined;
		if (typeof options === "function") {
			callback = options;
			options = null;
		} else if (options && typeof (options as LoadOptions).callback === "function") {
			callback = (options as LoadOptions).callback;
		}

		if (!pkgs) {
			if (callback) callback();
			return;
		}

		let pkgList: string[] = Array.isArray(pkgs)
			? pkgs.flatMap((p: string) => p.split(","))
			: pkgs.split(",");

		pkgList = getNeededs(pkgList);
		loadResources(getRequests(pkgList), callback);
	};

	$load = (urls: string | string[], options?: string | (() => void) | LoadOptions | null): void => {
		let type: string | undefined;
		let callback: (() => void) | undefined;

		if (typeof options === "string") {
			type = options;
			options = null;
		} else if (typeof options === "function") {
			callback = options;
			options = null;
		} else if (options && typeof (options as LoadOptions).callback === "function") {
			callback = (options as LoadOptions).callback;
		}

		let urlList: string[] = Array.isArray(urls)
			? urls.flatMap((u: string) => u.split(","))
			: urls.split(",");

		const requests: Request[] = urlList.map((url: string): Request | null => {
			if (!url) return null;
			const contentType: string = (type === "css" || url.toLowerCase().endsWith(".css"))
				? "text/css"
				: ((options as LoadOptions)?.contentType || $packagesConfig.defaultContentType);
			return { url, contentType, package: "", pattern: {} as PatternDef };
		}).filter((item: Request | null): item is Request => Boolean(item));

		loadResources(requests, callback);
	};
})();
