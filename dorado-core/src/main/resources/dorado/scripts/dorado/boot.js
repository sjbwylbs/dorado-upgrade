"use strict";
// @ts-nocheck
/// <reference path="globals.d.ts" />
let $import;
let $load;
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
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 304) {
                        resolve(xhr.responseText);
                    }
                    else {
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
            pkgList.forEach((pkg) => {
                // 必须在递归前标记，否则 A→B→A 之类的循环依赖会导致无限递归
                if (visited.has(pkg))
                    return;
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
        pkgs.forEach((pkg) => {
            const def = packages[pkg];
            if (!def) {
                console.error(`Unknown package: [${pkg}]`);
                return;
            }
            const pattern = patterns[def.pattern] || defaultPattern;
            let fileNames = def.fileName || pkg;
            const contentType = def.contentType || pattern.contentType || $packagesConfig.defaultContentType;
            if (typeof fileNames === "string")
                fileNames = fileNames.split(",");
            fileNames.forEach((fileName) => {
                if (fileName.includes("(none)"))
                    return;
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
                if (isJavaScript(contentType)) {
                    tempRequests.push(request);
                }
                else {
                    cssRequests.push(request);
                }
            });
        });
        tempRequests.push(...cssRequests);
        const requests = [];
        let mergedRequest = null;
        const mergePkgs = (req) => {
            req.url = req.pattern.url.replace(/\$\{fileName}/g, req.package.join(",").replace(/\//g, "^"));
        };
        tempRequests.forEach((req) => {
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
            }
            else {
                requests.push(req);
            }
        });
        if (mergedRequest)
            mergePkgs(mergedRequest);
        requests.forEach((req) => {
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
            pkg.forEach((p) => (loadedPackages[p] = true));
        }
        else {
            loadedPackages[pkg] = true;
        }
    }
    function loadResourceAsync(request) {
        return new Promise((resolve, reject) => {
            findHead();
            let element;
            if (isStyleSheet(request.contentType)) {
                element = document.createElement("link");
                element.rel = "stylesheet";
                element.type = request.contentType;
                element.href = request.url;
                element.onload = () => resolve();
                element.onerror = () => reject(new Error(`Failed to load CSS: ${request.url}`));
            }
            else if (isJavaScript(request.contentType)) {
                element = document.createElement("script");
                element.type = request.contentType;
                element.src = request.url;
                element.onload = () => resolve();
                element.onerror = () => reject(new Error(`Failed to load JS: ${request.url}`));
            }
            else {
                element = document.createElement("script");
                element.type = request.contentType;
                fetchContent(request.url)
                    .then((content) => {
                    element.text = content;
                    resolve();
                })
                    .catch(reject);
            }
            if (request.id)
                element.id = request.id;
            head.appendChild(element);
            markRequestLoaded(request);
        });
    }
    function loadResourceSync(request) {
        console.info(`sync load ${request.url}`);
        const attrs = request.id ? `id="${request.id}" ` : "";
        if (isStyleSheet(request.contentType)) {
            document.write(`<link ${attrs} rel="stylesheet" type="${request.contentType}" href="${request.url}" />`);
        }
        else if (isJavaScript(request.contentType)) {
            document.write(`<script ${attrs} type="${request.contentType}" src="${request.url}"></script>`);
        }
        else {
            console.warn("Synchronous AJAX is deprecated and blocked by modern browsers.");
            findHead();
            const element = document.createElement("script");
            if (request.id)
                element.id = request.id;
            element.type = request.contentType;
            fetchContent(request.url).then((content) => (element.text = content));
            head.appendChild(element);
        }
        markRequestLoaded(request);
    }
    function loadResources(requests, callback) {
        if (!requests.length) {
            if (callback)
                callback();
            return;
        }
        if (callback) {
            requests.reduce((promise, request) => {
                return promise.then(() => loadResourceAsync(request));
            }, Promise.resolve()).then(callback).catch((err) => {
                console.error(err.message);
            });
        }
        else {
            if (/loaded|complete/.test(document.readyState)) {
                console.error("Cannot load script synchronously after the document is ready. Please provide a callback function.");
            }
            else {
                requests.forEach((req) => loadResourceSync(req));
            }
        }
    }
    // --- 暴露的全局 API ---
    $import = (pkgs, options) => {
        let callback;
        if (typeof options === "function") {
            callback = options;
            options = null;
        }
        else if (options && typeof options.callback === "function") {
            callback = options.callback;
        }
        if (!pkgs) {
            if (callback)
                callback();
            return;
        }
        let pkgList = Array.isArray(pkgs)
            ? pkgs.flatMap((p) => p.split(","))
            : pkgs.split(",");
        pkgList = getNeededs(pkgList);
        loadResources(getRequests(pkgList), callback);
    };
    $load = (urls, options) => {
        let type;
        let callback;
        if (typeof options === "string") {
            type = options;
            options = null;
        }
        else if (typeof options === "function") {
            callback = options;
            options = null;
        }
        else if (options && typeof options.callback === "function") {
            callback = options.callback;
        }
        let urlList = Array.isArray(urls)
            ? urls.flatMap((u) => u.split(","))
            : urls.split(",");
        const requests = urlList.map((url) => {
            if (!url)
                return null;
            const contentType = (type === "css" || url.toLowerCase().endsWith(".css"))
                ? "text/css"
                : (options?.contentType || $packagesConfig.defaultContentType);
            return { url, contentType, package: "", pattern: {} };
        }).filter((item) => Boolean(item));
        loadResources(requests, callback);
    };
})();
