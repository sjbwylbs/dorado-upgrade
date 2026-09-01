let $import, $load;
const $packagesConfig = window.$packagesConfig || {};

const CONTEXT_TYPE = {
	CSS: 'text/css',
	JS: 'text/javascript'
};
$packagesConfig.defaultContentType = $packagesConfig.defaultContentType || CONTEXT_TYPE.JS;

(() => {
	const loadedPackages = {};
	let head;

	// --- 工具函数 ---
	const findHead = () => {
		head = document.getElementsByTagName("head")[0] || document.documentElement;
	};

	const isStyleSheet = (type) => type === CONTEXT_TYPE.CSS;
	const isJavaScript = (type) => type === CONTEXT_TYPE.JS;

	// --- 网络请求 (彻底移除同步请求和 IE ActiveX) ---
	function fetchContent(url) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest(); // 现代浏览器统一支持
			xhr.open("GET", url, true);       // 强制异步
			xhr.onreadystatechange = () => {  // 修复了原来大小写错误的 Bug
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
	function getNeededs(pkgs) {
		const packages = $packagesConfig.packages || {};
		const needed = [];
		const visited = new Set(); // 已处理的包，用于去重并切断循环依赖

		function traverse(pkgList) {
			pkgList.forEach(pkg => {
				// 必须在递归前标记，否则 A→B→A 之类的循环依赖会导致无限递归
				if (visited.has(pkg)) return;
				visited.add(pkg);
				const def = packages[pkg];
				if (def?.depends) {
					const deps = Array.isArray(def.depends) ? def.depends : def.depends.split(",");
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
	function getRequests(pkgs) {
		const patterns = $packagesConfig.patterns || {};
		const packages = $packagesConfig.packages || {};
		const defaultPattern = patterns["default"] || {};

		const tempRequests = [];
		const cssRequests = [];

		pkgs.forEach(pkg => {
			const def = packages[pkg];
			if (!def) {
				console.error(`Unknown package: [${pkg}]`);
				return;
			}

			const pattern = patterns[def.pattern] || defaultPattern;
			let fileNames = def.fileName || pkg;
			const contentType = def.contentType || pattern.contentType || $packagesConfig.defaultContentType;

			if (typeof fileNames === "string") fileNames = fileNames.split(",");

			fileNames.forEach(fileName => {
				if (fileName.includes("(none)")) return;

				const url = pattern.url
					? pattern.url.replace(/\$\{fileName}/g, fileName)
					: fileName;

				const request = {
					id: `_package_${pkg}`,
					package: pkg,
					url,
					contentType,
					pattern
				};

				// JS 放前面，CSS 放后面保证加载顺序
				if (isJavaScript(contentType)) {
					tempRequests.push(request);
				} else {
					cssRequests.push(request);
				}
			});
		});

		tempRequests.push(...cssRequests);

		// 处理合并请求逻辑
		const requests = [];
		let mergedRequest = null;

		const mergePkgs = (req) => {
			req.url = req.pattern.url.replace(
				/\$\{fileName}/g,
				req.package.join(",").replace(/\//g, "^")
			);
		};

		tempRequests.forEach(req => {
			if (mergedRequest && mergedRequest.pattern !== req.pattern) {
				mergePkgs(mergedRequest);
				mergedRequest = null;
			}

			if (req.pattern.mergeRequests) {
				if (!mergedRequest) {
					mergedRequest = { ...req };
					delete mergedRequest.id;
					mergedRequest.package = [];
					requests.push(mergedRequest);
				}
				mergedRequest.package.push(req.package);
			} else {
				requests.push(req);
			}
		});

		if (mergedRequest) mergePkgs(mergedRequest);

		// 处理上下文路径 (简化路径拼接逻辑)
		requests.forEach(req => {
			if (req.url.startsWith(">")) {
				const base = ($packagesConfig.contextPath || "/").replace(/\/$/, "");
				const path = req.url.substring(1).replace(/^\//, "");
				req.url = `${base}/${path}`;
			}
		});

		return requests;
	}

	// --- 资源加载核心 ---
	function markRequestLoaded(request) {
		const pkg = request.package;
		if (Array.isArray(pkg)) {
			pkg.forEach(p => loadedPackages[p] = true);
		} else {
			loadedPackages[pkg] = true;
		}
	}

	// 现代化异步加载单个资源 (返回 Promise)
	function loadResourceAsync(request) {
		return new Promise((resolve, reject) => {
			findHead();
			let element;

			if (isStyleSheet(request.contentType)) {
				element = document.createElement("link");
				element.rel = "stylesheet";
				element.type = request.contentType;
				element.href = request.url;
				// CSS 加载完成检测
				element.onload = () => resolve();
				element.onerror = () => reject(new Error(`Failed to load CSS: ${request.url}`));
			} else if (isJavaScript(request.contentType)) {
				element = document.createElement("script");
				element.type = request.contentType;
				element.src = request.url;
				element.onload = () => resolve();
				element.onerror = () => reject(new Error(`Failed to load JS: ${request.url}`));
			} else {
				// 其他类型：通过 Ajax 获取内容并内嵌
				element = document.createElement("script");
				element.type = request.contentType;
				fetchContent(request.url)
					.then(content => {
						element.text = content;
						resolve();
					})
					.catch(reject);
			}

			if (request.id) element.id = request.id;
			head.appendChild(element); // 改用 appendChild，insertBefore(firstChild) 不利于浏览器流式解析
			markRequestLoaded(request);
		});
	}

	// 同步加载 (仅在文档加载中使用 document.write)
	function loadResourceSync(request) {
		console.info(`sync load ${request.url}`)
		const attrs = request.id ? `id="${request.id}" ` : "";
		if (isStyleSheet(request.contentType)) {
			document.write(`<link ${attrs} rel="stylesheet" type="${request.contentType}" href="${request.url}" />`);
		} else if (isJavaScript(request.contentType)) {
			document.write(`<script ${attrs} type="${request.contentType}" src="${request.url}"></script>`);
		} else {
			console.warn("Synchronous AJAX is deprecated and blocked by modern browsers.");
			// 现代浏览器如果在文档解析后调用同步Ajax会直接报错，此处降级为异步或抛出异常
			findHead();
			const element = document.createElement("script");
			if (request.id) element.id = request.id;
			element.type = request.contentType;
			fetchContent(request.url).then(content => element.text = content);
			head.appendChild(element);
		}
		markRequestLoaded(request);
	}

	// 批量加载调度器
	function loadResources(requests, callback) {
		if (!requests.length) {
			if (callback) callback();
			return;
		}

		// 有回调函数：走异步 Promise 链
		if (callback) {
			requests.reduce((promise, request) => {
				return promise.then(() => loadResourceAsync(request));
			}, Promise.resolve()).then(callback).catch(err => {
				console.error(err.message);
			});
		}
		// 无回调函数：尝试同步写入文档流
		else {
			if (/loaded|complete/.test(document.readyState)) {
				console.error("Cannot load script synchronously after the document is ready. Please provide a callback function.");
			} else {
				requests.forEach(req => loadResourceSync(req));
			}
		}
	}

	// --- 暴露的全局 API ---
	$import = (pkgs, options) => {
		let callback;
		if (typeof options === "function") {
			callback = options;
			options = null;
		} else if (options && typeof options.callback === "function") {
			callback = options.callback;
		}

		if (!pkgs) {
			if (callback) callback();
			return;
		}

		// 规范化输入为数组
		let pkgList = Array.isArray(pkgs)
			? pkgs.flatMap(p => p.split(","))
			: pkgs.split(",");

		pkgList = getNeededs(pkgList);
		loadResources(getRequests(pkgList), callback);
	};

	$load = (urls, options) => {
		let type, callback;

		if (typeof options === "string") {
			type = options;
			options = null;
		} else if (typeof options === "function") {
			callback = options;
			options = null;
		} else if (options && typeof options.callback === "function") {
			callback = options.callback;
		}

		let urlList = Array.isArray(urls)
			? urls.flatMap(u => u.split(","))
			: urls.split(",");

		const requests = urlList.map(url => {
			if (!url) return null;
			const contentType = (type === "css" || url.toLowerCase().endsWith(".css"))
				? "text/css"
				: (options?.contentType || $packagesConfig.defaultContentType);
			return { url, contentType };
		}).filter(Boolean);

		loadResources(requests, callback);
	};
})();