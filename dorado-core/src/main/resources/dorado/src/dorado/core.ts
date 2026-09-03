// @ts-nocheck
/// <reference path="globals.d.ts" />

(function() {
  try {
    if (HTMLElement && !HTMLElement.prototype.innerText) {
      HTMLElement.prototype.__defineGetter__("innerText", function() {
        let text = this.textContent;
        if (text) {
          text = text.replace(/<BR>/g, "\n");
        }
        return text;
      });
      HTMLElement.prototype.__defineSetter__("innerText", function(text: any) {
        if (text && text.constructor === String) {
          let sections = text.split("\n");
          if (sections.length > 1) {
            this.innerHTML = "";
            for (let i = 0; i < sections.length; i++) {
              if (i > 0) {
                this.appendChild(document.createElement("BR"));
              }
              this.appendChild(document.createTextNode(sections[i]));
            }
            return;
          }
        }
        this.textContent = text;
      });
    }
  }
  catch (ex) {
  }
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(str: any) {
      return this.slice(0, str.length) === str;
    };
  }
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(str: any) {
      return this.slice(-str.length) === str;
    };
  }
  if (!Array.prototype.push) {
    Array.prototype.push = function(element: any) {
      this[this.length] = element;
    };
  }
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(element: any) {
      for (let i = 0; i < this.length; i++) {
        if (this[i] === element) {
          return i;
        }
      }
      return -1;
    };
  }
  if (!Array.prototype.remove) {
    Array.prototype.remove = function(element: any) {
      let i = this.indexOf(element);
      if (i >= 0) {
        this.splice(i, 1);
      }
      return i;
    };
  }
  if (!Array.prototype.removeAt) {
    Array.prototype.removeAt = function(i: any) {
      this.splice(i, 1);
    };
  }
  if (!Array.prototype.insert) {
    Array.prototype.insert = function(element: any, i: any) {
      this.splice(i || 0, 0, element);
    };
  }
  if (!Array.prototype.peek) {
    Array.prototype.peek = function() {
      return this[this.length - 1];
    };
  }
  if (!Array.prototype.each) {
    Array.prototype.each = function(fn: any) {
      for (let i = 0; i < this.length; i++) {
        if (fn.call(this, this[i], i) === false) {
          break;
        }
      }
    };
  }
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(target: any) {
      let fn = this;
      return function() {
        return fn.apply(target, arguments);
      };
    };
  }
})();
(function($: any) {
  let matched, browser;
  jQuery.uaMatch = function(ua: any) {
    ua = ua.toLowerCase();
    let match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || /(trident).*rv\:([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
    return {browser:match[1] || "", version:match[2] || "0"};
  };
  matched = jQuery.uaMatch(navigator.userAgent);
  browser = {};
  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
  }
  if (browser.chrome) {
    browser.webkit = true;
  } else {
    if (browser.webkit) {
      browser.safari = true;
    } else {
      if (browser.trident) {
        browser.msie = true;
      }
    }
  }
  jQuery.browser = browser;
  let superReady = $.prototype.ready;
  $.prototype.ready = function(fn: any) {
    if (jQuery.browser.webkit) {
      let self = this;
      function waitForReady() {
        if (document.readyState !== "complete") {
          setTimeout(waitForReady, 10);
        } else {
          superReady.call(self, fn);
        }
      }
      waitForReady();
    } else {
      superReady.call(this, fn);
    }
  };
  let flyableElem = $();
  flyableElem.length = 1;
  let flyableArray = $();
  $fly = function(elems: any) {
    if (elems instanceof Array) {
      if ((dorado.Browser.mozilla && dorado.Browser.version >= 2) || dorado.Browser.msie) {
        for (let i = flyableArray.length - 1; i >= 0; i--) {
          delete flyableArray[i];
        }
      }
      Array.prototype.splice.call(flyableArray, 0, flyableArray.length);
      Array.prototype.push.apply(flyableArray, elems);
      return flyableArray;
    } else {
      flyableElem[0] = elems;
      return flyableElem;
    }
  };
})(jQuery);
let dorado = {id:"_" + parseInt(Math.random() * Math.pow(10, 8)), _ID_SEED:0, _TIMESTAMP_SEED:0, _GET_ID:function(obj: any) {
    return obj._id;
  }, _GET_NAME:function(obj: any) {
    return obj._name;
  }, _NULL_FUNCTION:function() {
  }, _UNSUPPORTED_FUNCTION:function() {
    return function() {
      throw new dorado.ResourceException("dorado.core.OperationNotSupported", dorado.getFunctionDescription(arguments.callee));
    };
  }, Browser:(function() {
    let browser = {};
    for (let p in jQuery.browser) {
      if (jQuery.browser.hasOwnProperty(p)) {
        browser[p] = jQuery.browser[p];
      }
    }
    function detect(ua: any) {
      let os = {}, android = ua.match(/(Android)[\s+,;]([\d.]+)?/), android_40 = ua.match(/(Android)\s+(4.0)/), ipad = ua.match(/(iPad).*OS\s([\d_]+)/), iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/), miui = ua.match(/(MiuiBrowser)\/([\d.]+)/i);
      if (android) {
        os.android = true;
        os.version = android[2];
      } else {
        if (iphone) {
          os.ios = true;
          os.version = iphone[2].replace(/_/g, ".");
          os.iphone = true;
        } else {
          if (ipad) {
            os.ios = true;
            os.version = ipad[2].replace(/_/g, ".");
            os.ipad = true;
          }
        }
      }
      if (miui) {
        os.miui = true;
      }
      if (android_40) {
        os.android_40 = true;
      }
      return os;
    }
    let ua = navigator.userAgent, os = detect(ua);
    if (os.iphone) {
      browser.isPhone = os.iphone;
    } else {
      if (os.android) {
        let screenSize = window.screen.width;
        if (screenSize > window.screen.height) {
          screenSize = window.screen.height;
        }
        browser.isPhone = (screenSize / window.devicePixelRatio) < 768;
        if (os.miui) {
          browser.miui = true;
        }
      }
    }
    browser.android = os.android;
    browser.android_40 = os.android_40;
    browser.iOS = os.ios;
    browser.osVersion = os.version;
    browser.isTouch = (browser.android || browser.iOS) && !!("ontouchstart" in window || (window["$setting"] && $setting["common.simulateTouch"]));
    browser.version = parseInt(browser.version);
    return browser;
  })(), beforeInit:function(listener: any) {
    if (this.beforeInitFired) {
      throw new dorado.Exception("'beforeInit' already fired.");
    }
    if (!this.beforeInitListeners) {
      this.beforeInitListeners = [];
    }
    this.beforeInitListeners.push(listener);
  }, fireBeforeInit:function() {
    if (this.beforeInitListeners) {
      this.beforeInitListeners.each(function(listener: any) {
        return listener.call(dorado);
      });
      delete this.beforeInitListeners;
    }
    this.beforeInitFired = true;
  }, onInit:function(listener: any) {
    if (this.onInitFired) {
      throw new dorado.Exception("'onInit' already fired.");
    }
    if (!this.onInitListeners) {
      this.onInitListeners = [];
    }
    this.onInitListeners.push(listener);
  }, fireOnInit:function() {
    if (this.onInitListeners) {
      this.onInitListeners.each(function(listener: any) {
        return listener.call(dorado);
      });
      delete this.onInitListeners;
    }
    this.onInitFired = true;
  }, afterInit:function(listener: any) {
    if (this.afterInitFired) {
      throw new dorado.Exception("'afterInit' already fired.");
    }
    if (!this.afterInitListeners) {
      this.afterInitListeners = [];
    }
    this.afterInitListeners.push(listener);
  }, fireAfterInit:function() {
    if (this.afterInitListeners) {
      this.afterInitListeners.each(function(listener: any) {
        return listener.call(dorado);
      });
      delete this.afterInitListeners;
    }
    this.afterInitFired = true;
  }, defaultToString:function(obj: any) {
    let s = obj.constructor.className || "[Object]";
    if (obj.id) {
      s += (" id=" + obj.id);
    }
    if (obj.name) {
      s += (" name=" + obj.name);
    }
  }, getFunctionDescription:function(fn: any) {
    let defintion = fn.toString().split("\n")[0], name;
    if (fn.methodName) {
      let className;
      if (fn.declaringClass) {
        className = fn.declaringClass.className;
      }
      name = (className ? (className + ".") : "function ") + fn.methodName;
    } else {
      let regexpResult = defintion.match(/^function(\w*: any)/);
      name = "function " + (regexpResult && regexpResult[1] || "anonymous");
    }
    let regexpResult = defintion.match(/\((.*)\)/);
    return name + (regexpResult && regexpResult[0]);
  }, getFunctionInfo:function(fn: any) {
    let defintion = fn.toString().substring(8), len = defintion.length, name = "", signature = "";
    let inSignatrue = false;
    for (let i = 0; i < len; i++) {
      let c = defintion.charAt(i);
      if (c === " " || c === "\t" || c === "\n" || c === "\r") {
        continue;
      } else {
        if (c === "(") {
          inSignatrue = true;
        } else {
          if (c === ")") {
            break;
          } else {
            if (inSignatrue) {
              signature += c;
            } else {
              name += c;
            }
          }
        }
      }
    }
    return {name:name, signature:signature};
  }};
dorado.Core = {VERSION:"8.0.0", newId:function() {
    return "_uid_" + (++dorado._ID_SEED);
  }, getTimestamp:function() {
    return ++dorado._TIMESTAMP_SEED;
  }, scopify:function(scope: any, fn: any) {
    if (typeof fn === "function") {
      return function() {
        return fn.apply(scope, arguments);
      };
    } else {
      // CSP 兼容：不支持字符串形式的函数，要求传入函数对象
      console.warn("scopify: String functions are not supported in CSP-compliant mode. Please provide a function object.");
      return function() {
        return null;
      };
    }
  }, createClassFromString:function(className: any) {
    // CSP 兼容：通过类注册表查找并实例化，替代 eval("new " + className + "()")
    if (!className || typeof className !== "string") {
      return null;
    }
    // 尝试从 dorado 类注册表查找
    if (dorado.Core.CLASS_REPOSITORY && dorado.Core.CLASS_REPOSITORY[className]) {
      return new dorado.Core.CLASS_REPOSITORY[className]();
    }
    // 尝试从全局命名空间查找（如 "dorado.widget.Button"）
    const parts = className.split(".");
    let obj = window;
    for (let i = 0; i < parts.length; i++) {
      obj = obj[parts[i]];
      if (!obj) {
        console.warn("Class not found:", className);
        return null;
      }
    }
    if (typeof obj === "function") {
      return new obj();
    }
    console.warn("Not a constructor:", className);
    return null;
  }, setTimeout:function(scope: any, fn: any, timeMillis: any) {
    // CSP 兼容：通过类注册表查找并实例化，替代 eval("new " + className + "()")
    if (!className || typeof className !== "string") {
      return null;
    }
    // 尝试从 dorado 类注册表查找
    if (dorado.Core.CLASS_REPOSITORY && dorado.Core.CLASS_REPOSITORY[className]) {
      return new dorado.Core.CLASS_REPOSITORY[className]();
    }
    // 尝试从全局命名空间查找（如 "dorado.widget.Button"）
    const parts = className.split(".");
    let obj = window;
    for (let i = 0; i < parts.length; i++) {
      obj = obj[parts[i]];
      if (!obj) {
        console.warn("Class not found:", className);
        return null;
      }
    }
    if (typeof obj === "function") {
      return new obj();
    }
    console.warn("Not a constructor:", className);
    return null;
  }, setTimeout:function(scope: any, fn: any, timeMillis: any) {
    // CSP 兼容：通过类注册表查找并实例化，替代 eval("new " + className + "()")
    if (!className || typeof className !== "string") {
      return null;
    }
    // 尝试从 dorado 类注册表查找
    if (dorado.Core.CLASS_REPOSITORY && dorado.Core.CLASS_REPOSITORY[className]) {
      return new dorado.Core.CLASS_REPOSITORY[className]();
    }
    // 尝试从全局命名空间查找（如 "dorado.widget.Button"）
    const parts = className.split(".");
    let obj = window;
    for (let i = 0; i < parts.length; i++) {
      obj = obj[parts[i]];
      if (!obj) {
        console.warn("Class not found:", className);
        return null;
      }
    }
    if (typeof obj === "function") {
      return new obj();
    }
    console.warn("Not a constructor:", className);
    return null;
  }, setTimeout:function(scope: any, fn: any, timeMillis: any) {
    // CSP 兼容：通过类注册表查找并实例化，替代 eval("new " + className + "()")
    if (!className || typeof className !== "string") {
      return null;
    }
    // 尝试从 dorado 类注册表查找
    if (dorado.Core.CLASS_REPOSITORY && dorado.Core.CLASS_REPOSITORY[className]) {
      return new dorado.Core.CLASS_REPOSITORY[className]();
    }
    // 尝试从全局命名空间查找（如 "dorado.widget.Button"）
    const parts = className.split(".");
    let obj = window;
    for (let i = 0; i < parts.length; i++) {
      obj = obj[parts[i]];
      if (!obj) {
        console.warn("Class not found:", className);
        return null;
      }
    }
    if (typeof obj === "function") {
      return new obj();
    }
    console.warn("Not a constructor:", className);
    return null;
  }, setTimeout:function(scope: any, fn: any, timeMillis: any) {
    // CSP 兼容：通过类注册表查找并实例化，替代 eval("new " + className + "()")
    if (!className || typeof className !== "string") {
      return null;
    }
    // 尝试从 dorado 类注册表查找
    if (dorado.Core.CLASS_REPOSITORY && dorado.Core.CLASS_REPOSITORY[className]) {
      return new dorado.Core.CLASS_REPOSITORY[className]();
    }
    // 尝试从全局命名空间查找（如 "dorado.widget.Button"）
    const parts = className.split(".");
    let obj = window;
    for (let i = 0; i < parts.length; i++) {
      obj = obj[parts[i]];
      if (!obj) {
        console.warn("Class not found:", className);
        return null;
      }
    }
    if (typeof obj === "function") {
      return new obj();
    }
    console.warn("Not a constructor:", className);
    return null;
  }, setTimeout:function(scope: any, fn: any, timeMillis: any) {
    if (dorado.Browser.mozilla && dorado.Browser.version >= 8) {
      return window.setTimeout(function() {
        (dorado.Core.scopify(scope, fn))();
      }, timeMillis);
    } else {
      return setTimeout(dorado.Core.scopify(scope, fn), timeMillis);
    }
  }, setInterval:function(scope: any, fn: any, timeMillis: any) {
    if (dorado.Browser.mozilla && dorado.Browser.version >= 8) {
      return setInterval(function() {
        (dorado.Core.scopify(scope, fn))();
      }, timeMillis);
    } else {
      return setInterval(dorado.Core.scopify(scope, fn), timeMillis);
    }
  }, clone:function(obj: any, deep: any) {
    function doClone(obj: any, deep: any) {
      if (obj == null || typeof (obj) !== "object") {
        return obj;
      }
      if (typeof obj.clone === "function") {
        return obj.clone(deep);
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      } else {
        let constr = obj.constructor;
        let cloned = new constr();
        for (let attr in obj) {
          if (cloned[attr] === undefined) {
            let v = obj[attr];
            if (deep) {
              v = doClone(v, deep);
            }
            cloned[attr] = v;
          }
        }
        return cloned;
      }
    }
    return doClone(obj, deep);
  }};
(function() {
  window.$create = (dorado.Browser.msie && dorado.Browser.version < 9) ? document.createElement : function(arg: any) {
    return document.createElement(arg);
  };
  window.$scopify = dorado.Core.scopify;
  window.$setTimeout = dorado.Core.setTimeout;
  window.$setInterval = dorado.Core.setInterval;
})();
(function() {
  let CLASS_REPOSITORY = {};
  let UNNAMED_CLASS = "#UnnamedClass";
  function newClassName(prefix: any) {
    let i = 1;
    while (CLASS_REPOSITORY[prefix + i]) {
      i++;
    }
    return prefix + i;
  }
  function adapterFunction(fn: any) {
    let adapter = function() {
      return fn.apply(this, arguments);
    };
    adapter._doradoAdapter = true;
    return adapter;
  }
  function cloneDefintions(defs: any) {
    let newDefs = {};
    for (let p in defs) {
      if (defs.hasOwnProperty(p)) {
        newDefs[p] = dorado.Object.apply({}, defs[p]);
      }
    }
    return newDefs;
  }
  function overrideDefintions(subClass: any, defProp: any, defs: any, overwrite: any) {
    if (!defs) {
      return;
    }
    let sdefs = subClass.prototype[defProp];
    if (!sdefs) {
      subClass.prototype[defProp] = cloneDefintions(defs);
    } else {
      for (let p in defs) {
        if (defs.hasOwnProperty(p)) {
          let odef = defs[p];
          if (odef === undefined) {
            return;
          }
          let cdef = sdefs[p];
          if (cdef === undefined) {
            sdefs[p] = cdef = {};
          }
          for (let m in odef) {
            if (odef.hasOwnProperty(m) && (overwrite || cdef[m] === undefined)) {
              let odefv = odef[m];
              if (typeof odefv === "function") {
                if (!odefv.declaringClass) {
                  odefv.declaringClass = subClass;
                  odefv.methodName = m;
                  odefv.definitionType = defProp;
                  odefv.definitionName = p;
                }
              }
              cdef[m] = odefv;
            }
          }
        }
      }
    }
  }
  function override(subClass: any, overrides: any, overwrite: any) {
    if (!overrides) {
      return;
    }
    if (overwrite === undefined) {
      overwrite = true;
    }
    let subp = subClass.prototype;
    for (let p in overrides) {
      let override = overrides[p];
      if (p === "ATTRIBUTES" || p === "EVENTS") {
        overrideDefintions(subClass, p, override, overwrite);
        continue;
      }
      if (subp[p] === undefined || overwrite) {
        if (typeof override === "function") {
          if (!override.declaringClass) {
            override.declaringClass = subClass;
            override.methodName = p;
          }
        }
        subp[p] = override;
      }
    }
  }
  dorado.Object = {createNamespace:function(name: any) {
      let names = name.split(".");
      let parent = window;
      for (let i = 0; i < names.length; i++) {
        let n = names[i];
        let p = parent[n];
        if (p === undefined) {
          parent[n] = p = {};
        }
        parent = p;
      }
      return parent;
    }, createClass:function(p: any) {
      let constr = p.constructor;
      if (constr === Object) {
        constr = function() {};
      }
      constr.className = p.$className || newClassName(UNNAMED_CLASS);
      delete p.$className;
      for (let m in p) {
        if (p.hasOwnProperty(m)) {
          let v = p[m];
          if (typeof v === "function") {
            if (!v.declaringClass) {
              v.declaringClass = constr;
              v.methodName = m;
            }
          }
        }
      }
      constr.prototype = p;
      CLASS_REPOSITORY[constr.className] = constr;
      return constr;
    }, override:override, extend:(function() {
      let oc = Object.prototype.constructor;
      return function(superClass: any, overrides: any) {
        let sc, scs;
        if (superClass instanceof Array) {
          scs = superClass;
          sc = superClass[0];
        } else {
          sc = superClass;
        }
        let subClass = (overrides && overrides.constructor !== oc) ? overrides.constructor : function() {
          sc.apply(this, arguments);
        };
        let fn = function() {};
        let sp = fn.prototype = sc.prototype;
        if (!sc.className) {
          sp.constructor = sc;
          sc.className = newClassName(UNNAMED_CLASS);
          sc.declaringClass = sp;
          sc.methodName = "constructor";
        }
        let subp = subClass.prototype = new fn();
        subp.constructor = subClass;
        subClass.className = overrides.$className || newClassName((sc.$className || UNNAMED_CLASS) + "$");
        subClass.superClass = sc;
        subClass.declaringClass = subClass;
        subClass.methodName = "constructor";
        delete overrides.$className;
        delete overrides.constructor;
        let attrs = subp["ATTRIBUTES"];
        if (attrs) {
          subp["ATTRIBUTES"] = cloneDefintions(attrs);
        }
        let events = subp["EVENTS"];
        if (events) {
          subp["EVENTS"] = cloneDefintions(events);
        }
        let ps = [sc];
        if (scs) {
          for (let i = 1, p; i < scs.length; i++) {
            p = scs[i].prototype;
            override(subClass, p, false);
            ps.push(scs[i]);
          }
        }
        subClass.superClasses = ps;
        override(subClass, overrides, true);
        CLASS_REPOSITORY[subClass.className] = subClass;
        return subClass;
      };
    })(), eachProperty:function(object: any, fn: any) {
      if (object && fn) {
        for (let p in object) {
          fn.call(object, p, object[p]);
        }
      }
    }, apply:function(target: any, source: any, options: any) {
      if (source) {
        for (let p in source) {
          if (typeof options === "function" && options.call(target, p, source[p]) === false) {
            continue;
          }
          if (options === false && target[p] !== undefined) {
            continue;
          }
          target[p] = source[p];
        }
      }
      return target;
    }, isInstanceOf:function(object: any, type: any) {
      function hasSuperClass(superClasses: any) {
        if (!superClasses) {
          return false;
        }
        if (superClasses.indexOf(type) >= 0) {
          return true;
        }
        for (let i = 0; i < superClasses.length; i++) {
          if (hasSuperClass(superClasses[i].superClasses)) {
            return true;
          }
        }
        return false;
      }
      if (!object) {
        return false;
      }
      let b = false;
      if (type.className) {
        b = object instanceof type;
      }
      if (!b) {
        let t = object.constructor;
        if (t) {
          b = hasSuperClass(t.superClasses);
        }
      }
      return b;
    }, clone:function(object: any, options: any) {
      if (typeof object === "object") {
        let objClone;
        options = options || {};
        if (options.onCreate) {
          objClone = new options.onCreate(object);
        } else {
          objClone = new object.constructor();
        }
        for (let p in object) {
          if (!options.onCopyProperty || options.onCopyProperty(p, object, objClone)) {
            objClone[p] = object[p];
          }
        }
        objClone.toString = object.toString;
        objClone.valueOf = object.valueOf;
        return objClone;
      } else {
        return object;
      }
    }, hashCode:function(object: any) {
      if (object == null) {
        return 0;
      }
      let strKey = (typeof object) + "|" + dorado.JSON.stringify(object), hash = 0;
      for (i = 0; i < strKey.length; i++) {
        let c = strKey.charCodeAt(i);
        hash = ((hash << 5) - hash) + c;
        hash = hash & hash;
      }
      return hash;
    }};
  window.$namespace = dorado.Object.createNamespace;
  window.$class = dorado.Object.createClass;
  window.$extend = dorado.Object.extend;
  let getSuperClass = window.$getSuperClass = function() {
    let fn = getSuperClass.caller, superClass;
    if (fn.declaringClass) {
      superClass = fn.declaringClass.superClass;
    }
    return superClass || {};
  };
  let getSuperClasses = window.$getSuperClasses = function() {
    let fn = getSuperClasses.caller, superClass;
    if (dorado.Browser.opera && dorado.Browser.version < 10) {
      fn = fn.caller;
    }
    if (fn.caller && fn.caller._doradoAdapter) {
      fn = fn.caller;
    }
    if (fn.declaringClass) {
      superClasses = fn.declaringClass.superClasses;
    }
    return superClasses || [];
  };
  let invokeSuper = window.$invokeSuper = function(args: any) {
    let fn = invokeSuper.caller;
    if (fn.caller && fn.caller._doradoAdapter) {
      fn = fn.caller;
    }
    if (fn.declaringClass) {
      let superClasses = fn.declaringClass.superClasses;
      if (!superClasses) {
        return;
      }
      let superClass, superFn;
      for (let i = 0; i < superClasses.length; i++) {
        superClass = superClasses[i].prototype;
        if (fn.definitionType) {
          superFn = superClass[fn.definitionType][fn.definitionName][fn.methodName];
        } else {
          superFn = superClass[fn.methodName];
        }
        if (superFn) {
          return superFn.apply(this, args || []);
        }
      }
    }
  };
  invokeSuper.methodName = "$invokeSuper";
})();
(function() {
  let doradoServierURI = ">dorado/view-service";
  dorado.Setting = {"common.defaultDateFormat":"Y-m-d", "common.defaultTimeFormat":"H:i:s", "common.defaultDateTimeFormat":"Y-m-d H:i:s", "common.defaultDisplayDateFormat":"Y-m-d", "common.defaultDisplayTimeFormat":"H:i:s", "common.defaultDisplayDateTimeFormat":"Y-m-d H:i:s", "ajax.defaultOptions":{batchable:true}, "ajax.dataTypeRepositoryOptions":{url:doradoServierURI, method:"POST", batchable:true}, "ajax.dataProviderOptions":{url:doradoServierURI, method:"POST", batchable:true}, "ajax.dataResolverOptions":{url:doradoServierURI, method:"POST", batchable:true}, "ajax.remoteServiceOptions":{url:doradoServierURI, method:"POST", batchable:true}, "longPolling.pollingOptions":{url:doradoServierURI, method:"GET", batchable:false}, "longPolling.sendingOptions":{url:doradoServierURI, method:"POST", batchable:true}, "ajax.loadViewOptions":{url:doradoServierURI, method:"GET", batchable:true}, "dom.useCssShadow":true, "widget.skin":"~current", "widget.panel.useCssCurveBorder":true, "widget.datepicker.defaultYearMonthFormat":"m &nbsp;&nbsp; Y"};
  if (window.$setting instanceof Object) {
    dorado.Object.apply(dorado.Setting, $setting);
  }
  let contextPath = dorado.Setting["common.contextPath"];
  if (contextPath) {
    if (contextPath.charAt(contextPath.length - 1) !== "/") {
      contextPath += "/";
    }
  } else {
    contextPath = "/";
  }
  dorado.Setting["common.contextPath"] = contextPath;
  window.$setting = dorado.Setting;
})();
dorado.AbstractException = $class({$className:"dorado.AbstractException", constructor:function() {
    dorado.Exception.EXCEPTION_STACK.push(this);
    if (dorado.Browser.msie || dorado.Browser.mozilla) {
      window.onerror = function(message: any, url: any, line: any) {
        let result = false;
        if (dorado.Exception.EXCEPTION_STACK.length > 0) {
          let e;
          while (e = dorado.Exception.EXCEPTION_STACK.peek()) {
            dorado.Exception.processException(e);
          }
          result = true;
        }
        window.onerror = null;
        return result;
      };
    }
    $setTimeout(this, function() {
      if (dorado.Exception.EXCEPTION_STACK.indexOf(this) >= 0) {
        dorado.Exception.processException(this);
      }
    }, 50);
  }});
dorado.Exception = $extend(dorado.AbstractException, {$className:"dorado.Exception", constructor:function(message: any) {
    this.message = message || this.$className;
    if ($setting["common.debugEnabled"]) {
      this._buildStackTrace();
    }
    $invokeSuper.call(this, arguments);
  }, _buildStackTrace:function() {
    let stack = [];
    let funcCaller = dorado.Exception.caller, callers = [];
    while (funcCaller && callers.indexOf(funcCaller) < 0) {
      callers.push(funcCaller);
      stack.push(dorado.getFunctionDescription(funcCaller));
      funcCaller = funcCaller.caller;
    }
    this.stack = stack;
    if (dorado.Browser.mozilla || dorado.Browser.chrome) {
      let stack = new Error().stack;
      if (stack) {
        stack = stack.split("\n");
        this.systemStack = stack.slice(2, stack.length - 1);
      }
    }
  }, formatStack:function(stack: any) {
    return dorado.Exception.formatStack(stack);
  }, toString:function() {
    return this.message;
  }});
dorado.Exception.formatStack = function(stack: any) {
  let msg = "";
  if (stack) {
    if (typeof stack === "string") {
      msg = stack;
    } else {
      for (let i = 0; i < stack.length; i++) {
        if (i > 0) {
          msg += "\n";
        }
        let trace = jQuery.trim(stack[i]);
        if (trace.indexOf("at ") !== 0) {
          trace = "at " + trace;
        }
        msg += " > " + trace;
        if (i > 255) {
          msg += "\n > ... ... ...";
          break;
        }
      }
    }
  }
  return msg;
};
dorado.AbortException = $extend(dorado.Exception, {$className:"dorado.AbortException"});
dorado.RunnableException = $extend(dorado.AbstractException, {$className:"dorado.RunnableException", constructor:function(script: any) {
    this.script = script;
    $invokeSuper.call(this, arguments);
  }, toString:function() {
    return this.script;
  }});
dorado.ResourceException = $extend(dorado.Exception, {$className:"dorado.ResourceException", constructor:function() {
    $invokeSuper.call(this, [$resource.apply(this, arguments)]);
  }});
dorado.RemoteException = $extend(dorado.Exception, {$className:"dorado.RemoteException", constructor:function(message: any, exceptionType: any, remoteStack: any) {
    $invokeSuper.call(this, [message]);
    this.exceptionType = exceptionType;
    this.remoteStack = remoteStack;
  }});
dorado.Exception.EXCEPTION_STACK = [];
dorado.Exception.IGNORE_ALL_EXCEPTIONS = false;
dorado.Exception.getExceptionMessage = function(e: any) {
  if (!e || e instanceof dorado.AbortException) {
    return null;
  }
  let msg;
  if (e instanceof dorado.Exception) {
    msg = e.message;
  } else {
    if (e instanceof Error) {
      msg = e.message;
    } else {
      msg = e;
    }
  }
  return msg;
};
dorado.Exception.processException = function(e: any) {
  if (dorado.Exception.IGNORE_ALL_EXCEPTIONS || dorado.windowClosed) {
    return;
  }
  if (!e) {
    dorado.Exception.removeException(e);
  }
  if (e instanceof dorado.AbortException) {
    dorado.Exception.removeException(e);
    return;
  }
  if (dorado._fireOnException(e) === false) {
    return;
  }
  dorado.Exception.removeException(e);
  if (e instanceof dorado.RunnableException) {
    // CSP 兼容：不支持动态执行脚本，改为记录警告
    console.warn("RunnableException: Dynamic script execution is not supported in CSP-compliant mode.");
    fn.call(window, e);
  } else {
    let delay = e._processDelay || 0;
    setTimeout(function() {
      if (dorado.windowClosed) {
        return;
      }
      let msg = dorado.Exception.getExceptionMessage(e);
      if ($setting["common.showExceptionStackTrace"]) {
        if (e instanceof dorado.Exception) {
          if (e.stack) {
            msg += "\n\nDorado Stack:\n" + dorado.Exception.formatStack(e.stack);
          }
          if (e.remoteStack) {
            msg += "\n\nRemote Stack:\n" + dorado.Exception.formatStack(e.remoteStack);
          }
          if (e.systemStack) {
            msg += "\n\nSystem Stack:\n" + dorado.Exception.formatStack(e.systemStack);
          }
        } else {
          if (e instanceof Error) {
            if (e.stack) {
              msg += "\n\nSystem Stack:\n" + dorado.Exception.formatStack(e.stack);
            }
          }
        }
      }
      if (window.console) {
        if (console.error) {
          console.error(msg);
        } else {
          console.log(msg);
        }
      }
      if (!dorado.Exception.alertException || !document.body) {
        dorado.Exception.removeException(e);
        alert(dorado.Exception.getExceptionMessage(e));
      } else {
        try {
          dorado.Exception.alertException(e);
        }
        catch (e2) {
          dorado.Exception.removeException(e2);
          alert(dorado.Exception.getExceptionMessage(e));
        }
      }
    }, delay);
  }
};
dorado.Exception.removeException = function(e: any) {
  dorado.Exception.EXCEPTION_STACK.remove(e);
};
dorado._exceptionListeners;
dorado.onException = function(listener: any) {
  if (!dorado._exceptionListeners) {
    dorado._exceptionListeners = [];
  }
  dorado._exceptionListeners.push(listener);
};
dorado._fireOnException = function(e: any) {
  if (dorado._exceptionListeners && dorado._exceptionListeners.length) {
    let arg = {exception:e, processDefault:true};
    dorado._exceptionListeners.each(function(listener: any) {
      if (listener.call(window, arg) === false) {
        return false;
      }
    });
    if (!arg.processDefault) {
      dorado.Exception.removeException(e);
      return false;
    }
  }
  return true;
};
(function() {
  dorado.AttributeException = $extend(dorado.ResourceException, {$className:"dorado.AttributeException"});
  dorado.AttributeSupport = $class({$className:"dorado.AttributeSupport", ATTRIBUTES:{tags:{setter:function(tags: any) {
          if (typeof tags === "string") {
            tags = tags.split(",");
          }
          if (this._tags) {
            dorado.TagManager.unregister(this);
          }
          this._tags = tags;
          if (tags) {
            dorado.TagManager.register(this);
          }
        }}}, EVENTS:{onAttributeChange:{}}, constructor:function() {
      let defs = this.ATTRIBUTES;
      for (let p in defs) {
        let def = defs[p];
        if (def && def.defaultValue !== undefined && this["_" + p] === undefined) {
          let dv = def.defaultValue;
          this["_" + p] = (typeof dv === "function" && !def.dontEvalDefaultValue) ? dv() : dv;
        }
      }
    }, getAttributeWatcher:function() {
      if (!this.attributeWatcher) {
        this.attributeWatcher = new dorado.AttributeWatcher(this._watcherData);
      }
      return this.attributeWatcher;
    }, get:function(attr: any) {
      let i = attr.indexOf(".");
      if (i > 0) {
        let result = this.doGet(attr.substring(0, i));
        if (result) {
          let subAttr = attr.substring(i + 1);
          if (typeof result.get === "function") {
            result = result.get(subAttr);
          } else {
            let as = subAttr.split(".");
            for (let i = 0; i < as.length; i++) {
              let a = as[i];
              result = (typeof result.get === "function") ? result.get(a) : result[a];
              if (!result) {
                break;
              }
            }
          }
        }
        return result;
      } else {
        return this.doGet(attr);
      }
    }, doGet:function(attr: any) {
      let def = this.ATTRIBUTES[attr] || (this.PRIVATE_ATTRIBUTES && this.PRIVATE_ATTRIBUTES[attr]);
      if (def) {
        if (def.writeOnly) {
          throw new dorado.AttributeException("dorado.core.AttributeWriteOnly", attr);
        }
        let result;
        if (def.getter) {
          result = def.getter.call(this, attr);
        } else {
          if (def.path) {
            let sections = def.path.split("."), owner = this;
            for (let i = 0; i < sections.length; i++) {
              let section = sections[i];
              if (section.charAt(0) !== "_" && typeof owner.get === "function") {
                owner = owner.get(section);
              } else {
                owner = owner[section];
              }
              if (owner == null || i === sections.length - 1) {
                result = owner;
                break;
              }
            }
          } else {
            result = this["_" + attr];
          }
        }
        return result;
      } else {
        throw new dorado.AttributeException("dorado.core.UnknownAttribute", attr);
      }
    }, set:function(attr: any, value: any, options: any) {
      let skipUnknownAttribute, tryNextOnError, preventOverwriting, lockWritingTimes;
      if (attr && typeof attr === "object") {
        options = value;
      }
      if (options && typeof options === "object") {
        skipUnknownAttribute = options.skipUnknownAttribute;
        tryNextOnError = options.tryNextOnError;
        preventOverwriting = options.preventOverwriting;
        lockWritingTimes = options.lockWritingTimes;
      }
      let watcherData = this._watcherData;
      if (attr.constructor !== String) {
        for (let p in attr) {
          if (attr.hasOwnProperty(p)) {
            let v = attr[p];
            if (p === "DEFINITION") {
              if (v) {
                if (v.ATTRIBUTES) {
                  if (!this.PRIVATE_ATTRIBUTES) {
                    this.PRIVATE_ATTRIBUTES = {};
                  }
                  for (let defName in v.ATTRIBUTES) {
                    if (v.ATTRIBUTES.hasOwnProperty(defName)) {
                      let def = v.ATTRIBUTES[defName];
                      overrideDefinition(this.PRIVATE_ATTRIBUTES, def, defName);
                      if (def && def.defaultValue !== undefined && this["_" + p] === undefined) {
                        let dv = def.defaultValue;
                        this["_" + p] = (typeof dv === "function" && !def.dontEvalDefaultValue) ? dv() : dv;
                      }
                    }
                  }
                }
                if (v.EVENTS) {
                  if (!this.PRIVATE_EVENTS) {
                    this.PRIVATE_EVENTS = {};
                  }
                  for (let defName in v.EVENTS) {
                    if (v.EVENTS.hasOwnProperty(defName)) {
                      overrideDefinition(this.PRIVATE_EVENTS, v.EVENTS[defName], defName);
                    }
                  }
                }
              }
            } else {
              if (preventOverwriting && watcherData && watcherData[p]) {
                continue;
              }
              try {
                this.doSet(p, v, skipUnknownAttribute, lockWritingTimes);
              }
              catch (e) {
                if (!tryNextOnError) {
                  throw e;
                } else {
                  if (e instanceof dorado.Exception) {
                    dorado.Exception.removeException(e);
                  }
                }
              }
            }
          }
        }
      } else {
        if (preventOverwriting && watcherData && watcherData[attr]) {
          return;
        }
        try {
          this.doSet(attr, value, skipUnknownAttribute, lockWritingTimes);
        }
        catch (e) {
          if (!tryNextOnError) {
            throw e;
          } else {
            if (e instanceof dorado.Exception) {
              dorado.Exception.removeException(e);
            }
          }
        }
      }
      return this;
    }, doSet:function(attr: any, value: any, skipUnknownAttribute: any, lockWritingTimes: any) {
      if (attr.charAt(0) === "$") {
        return;
      }
      let path, def;
      if (attr.indexOf(".") > 0) {
        path = attr;
      } else {
        def = this.ATTRIBUTES[attr] || (this.PRIVATE_ATTRIBUTES && this.PRIVATE_ATTRIBUTES[attr]);
        if (def) {
          path = def.path;
        }
      }
      if (path) {
        let sections = path.split("."), owner = this;
        for (let i = 0, len = sections.length - 1; i < len && owner != null; i++) {
          let section = sections[i];
          if (section.charAt(0) !== "_" && typeof owner.get === "function") {
            owner = owner.get(section);
          } else {
            owner = owner[section];
          }
        }
        if (owner != null) {
          let section = sections[sections.length - 1];
          (section.charAt(0) === "_") ? (owner[section] = value) : owner.set(section, value);
        } else {
          this["_" + attr] = value;
        }
      } else {
        if (def) {
          if (def.readOnly) {
            throw new dorado.AttributeException("dorado.core.AttributeReadOnly", attr);
          }
          let watcherData = this._watcherData;
          if (!watcherData) {
            this._watcherData = watcherData = {};
          }
          if (def.writeOnce && watcherData[attr]) {
            throw new dorado.AttributeException("dorado.core.AttributeWriteOnce", attr);
          }
          if (!lockWritingTimes) {
            watcherData[attr] = (watcherData[attr] || 0) + 1;
          }
          if (def.setter) {
            def.setter.call(this, value, attr);
          } else {
            this["_" + attr] = value;
          }
          if (this.fireEvent && this.getListenerCount("onAttributeChange")) {
            this.fireEvent("onAttributeChange", this, {attribute:attr, value:value});
          }
        } else {
          if (value instanceof Object && this.EVENTS && (this.EVENTS[attr] || (this.PRIVATE_EVENTS && this.PRIVATE_EVENTS[attr]))) {
            if (typeof value === "function") {
              this.bind(attr, value);
            } else {
              if (value.listener) {
                this.bind(attr, value.listener, value.options);
              }
            }
          } else {
            if (!skipUnknownAttribute) {
              throw new dorado.AttributeException("dorado.core.UnknownAttribute", attr);
            }
          }
        }
      }
    }, hasTag:function(tag: any) {
      if (this._tags) {
        return this._tags.indexOf(tag) >= 0;
      } else {
        return false;
      }
    }});
  dorado.AttributeWatcher = $class({$className:"dorado.AttributeWatcher", constructor:function(watcherData: any) {
      this._watcherData = watcherData;
    }, getWritingTimes:function(attr: any) {
      return (this._watcherData && this._watcherData[attr]) || 0;
    }});
  function overrideDefinition(targetDefs: any, def: any, name: any) {
    if (!def) {
      return;
    }
    let targetDef = targetDefs[name];
    if (targetDef) {
      dorado.Object.apply(targetDef, def);
    } else {
      targetDefs[name] = dorado.Object.apply({}, def);
    }
  }
})();
dorado.Callback = {};
window.$callback = dorado.Callback.invokeCallback = function(callback: any, success: any, arg: any, options: any) {
  function invoke(fn: any, args: any) {
    if (delay > 0) {
      setTimeout(function() {
        fn.apply(scope, args);
      }, delay);
    } else {
      fn.apply(scope, args);
    }
  }
  if (!callback) {
    return;
  }
  if (success == null) {
    success = true;
  }
  let scope, delay;
  if (options) {
    scope = options.scope;
    delay = options.delay;
  }
  if (typeof callback === "function") {
    if (!success) {
      return;
    }
    invoke(callback, [arg]);
  } else {
    scope = callback.scope || scope || window;
    delay = callback.delay || delay;
    if (typeof callback.callback === "function") {
      invoke(callback.callback, [success, arg]);
    }
    let name = (success) ? "success" : "failure";
    if (typeof callback[name] === "function") {
      invoke(callback.callback, [arg]);
    }
  }
};
dorado.Callback.simultaneousCallbacks = function(tasks: any, callback: any) {
  function getSimultaneousCallback(task: any) {
    let fn = function() {
      suspendedTasks.push({task:task, scope:this, args:arguments});
      if (taskReg[task.id]) {
        delete taskReg[task.id];
        taskNum--;
        if (taskNum === 0) {
          jQuery.each(suspendedTasks, function(i: any, suspendedTask: any) {
            suspendedTask.task.callback.apply(suspendedTask.scope, suspendedTask.args);
          });
          $callback(callback, true);
        }
      }
    };
    return fn;
  }
  let taskReg = {}, taskNum = tasks.length, suspendedTasks = [];
  if (taskNum > 0) {
    jQuery.each(tasks, function(i: any, task: any) {
      if (!task.id) {
        task.id = dorado.Core.newId();
      }
      let simCallback = getSimultaneousCallback(task);
      taskReg[task.id] = callback;
      task.run(simCallback);
    });
  } else {
    $callback(callback, true);
  }
};
dorado.EventSupport = $class({$className:"dorado.EventSupport", ATTRIBUTES:{listener:{setter:function(v: any) {
        if (!v) {
          return;
        }
        for (let p in v) {
          if (v.hasOwnProperty(p)) {
            let listener = v[p];
            if (listener) {
              if (listener instanceof Array) {
                for (let i = 0; i < listener.length; i++) {
                  let l = listener[i];
                  if (typeof l === "function") {
                    this.bind(p, l);
                  } else {
                    if (typeof l.fn === "function") {
                      this.bind(p, l.fn, l.options);
                    }
                  }
                }
              } else {
                if (typeof listener === "function") {
                  this.bind(p, listener);
                } else {
                  if (typeof listener.fn === "function") {
                    this.bind(p, listener.fn, listener.options);
                  }
                }
              }
            }
          }
        }
      }, writeOnly:true}}, EVENTS:{}, _disableListenersCounter:0, addListener:function(name: any, listener: any, options: any) {
    return this.bind(name, listener, options);
  }, removeListener:function(name: any, listener: any) {
    return this.unbind(name, listener);
  }, bind:function(name: any, listener: any, options: any) {
    let i = name.indexOf("."), alias;
    if (i > 0) {
      alias = name.substring(i + 1);
      name = name.substring(0, i);
    }
    let def = this.EVENTS[name] || (this.PRIVATE_EVENTS && this.PRIVATE_EVENTS[name]);
    if (!def) {
      throw new dorado.ResourceException("dorado.core.UnknownEvent", name);
    }
    let handler = dorado.Object.apply({}, options);
    handler.alias = alias;
    handler.listener = listener;
    handler.options = options;
    if (!this._events) {
      this._events = {};
    }
    let handlers = this._events[name];
    if (handlers) {
      if (def.disallowMultiListeners && handlers.length) {
        new dorado.ResourceException("dorado.core.MultiListenersNotSupport", name);
      }
      if (alias) {
        for (let i = handlers.length - 1; i >= 0; i--) {
          if (handlers[i].alias === alias) {
            handlers.removeAt(i);
          }
        }
      }
      handlers.push(handler);
    } else {
      this._events[name] = [handler];
    }
    return this;
  }, unbind:function(name: any, listener: any) {
    let i = name.indexOf("."), alias;
    if (i > 0) {
      alias = name.substring(i + 1);
      name = name.substring(0, i);
    }
    let def = this.EVENTS[name] || (this.PRIVATE_EVENTS && this.PRIVATE_EVENTS[name]);
    if (!def) {
      throw new dorado.ResourceException("dorado.core.UnknownEvent", name);
    }
    if (!this._events) {
      return;
    }
    if (listener) {
      let handlers = this._events[name];
      if (handlers) {
        for (let i = handlers.length - 1; i >= 0; i--) {
          if (handlers[i].listener === listener && (!alias || handlers[i].alias === alias)) {
            handlers.removeAt(i);
          }
        }
      }
    } else {
      if (alias) {
        let handlers = this._events[name];
        if (handlers) {
          for (let i = handlers.length - 1; i >= 0; i--) {
            if (handlers[i].alias === alias) {
              handlers.removeAt(i);
            }
          }
        }
      } else {
        delete this._events[name];
      }
    }
  }, clearListeners:function(name: any) {
    if (!this._events) {
      return;
    }
    this._events[name] = null;
  }, disableListeners:function() {
    this._disableListenersCounter++;
  }, enableListeners:function() {
    if (this._disableListenersCounter > 0) {
      this._disableListenersCounter--;
    }
  }, fireEvent:function(name: any) {
    let def = this.EVENTS[name] || (this.PRIVATE_EVENTS && this.PRIVATE_EVENTS[name]);
    if (!def) {
      throw new dorado.ResourceException("dorado.core.UnknownEvent", name);
    }
    let handlers = (this._events) ? this._events[name] : null;
    if ((!handlers || !handlers.length) && !def.interceptor) {
      return;
    }
    let self = this;
    let superFire = function() {
      if (handlers) {
        for (let i = 0; i < handlers.length; ) {
          let handler = handlers[i];
          if (handler.once) {
            handlers.removeAt(i);
          } else {
            i++;
          }
          if (self.notifyListener(handler, arguments) === false) {
            return false;
          }
        }
      }
      return true;
    };
    let interceptor = (typeof def.interceptor === "function") ? def.interceptor : null;
    if (interceptor) {
      arguments[0] = superFire;
      return interceptor.apply(this, arguments);
    } else {
      if (handlers && this._disableListenersCounter === 0) {
        return superFire.apply(this, Array.prototype.slice.call(arguments, 1));
      }
    }
    return true;
  }, getListenerCount:function(name: any) {
    if (this._events) {
      let handlers = this._events[name];
      return (handlers) ? handlers.length : 0;
    } else {
      return 0;
    }
  }, notifyListener:function(handler: any, args: any) {
    let listener = handler.listener;
    let scope = handler.scope;
    if (!scope && this.getListenerScope) {
      scope = this.getListenerScope();
    }
    scope = scope || this;
    if (handler.autowire !== false) {
      if (handler.signature === undefined) {
        let info = dorado.getFunctionInfo(handler.listener);
        if (!info.signature || info.signature === "self,arg") {
          handler.signature = null;
        } else {
          handler.signature = info.signature.split(",");
        }
      }
      if (handler.signature) {
        let customArgs = [];
        if (dorado.widget && dorado.widget.View && scope instanceof dorado.widget.View) {
          for (let i = 0; i < handler.signature.length; i++) {
            let param = handler.signature[i];
            if (param === "self") {
              customArgs.push(args[0]);
            } else {
              if (param === "arg") {
                customArgs.push(args[1]);
              } else {
                if (param === "view") {
                  customArgs.push(scope);
                } else {
                  let object = scope.id(param);
                  if (object == null) {
                    object = scope.getDataType(param);
                  }
                  if (!object) {
                    if (i === 0) {
                      object = args[0];
                    } else {
                      if (i === 1) {
                        object = args[1];
                      }
                    }
                  }
                  customArgs.push(object);
                }
              }
            }
          }
        } else {
          for (let i = 0; i < handler.signature.length; i++) {
            let param = handler.signature[i];
            if (param === "self") {
              customArgs.push(args[0]);
            } else {
              if (param === "arg") {
                customArgs.push(args[1]);
              } else {
                customArgs = null;
                break;
              }
            }
          }
        }
        if (customArgs) {
          args = customArgs;
        }
      }
    }
    let delay = handler.delay;
    if (delay >= 0) {
      setTimeout(function() {
        listener.apply(scope, args);
      }, delay);
    } else {
      return listener.apply(scope, args);
    }
  }});
dorado.util = {};
dorado.util.Resource = {strings:{}, append:function(namespace: any, items: any) {
    if (arguments.length === 1 && namespace && namespace.constructor !== String) {
      items = namespace;
      namespace = null;
    }
    for (let p in items) {
      if (items.hasOwnProperty(p)) {
        if (namespace) {
          this.strings[namespace + "." + p] = items[p];
        } else {
          this.strings[p] = items[p];
        }
      }
    }
  }, sprintf:function() {
    let num = arguments.length;
    let s = arguments[0];
    for (let i = 1; i < num; i++) {
      let pattern = "\\{" + (i - 1) + "\\}";
      let re = new RegExp(pattern, "g");
      s = s.replace(re, arguments[i]);
    }
    return s;
  }, get:function(path: any) {
    let str = this.strings[path];
    if (arguments.length > 1 && str) {
      arguments[0] = str;
      return this.sprintf.apply(this, arguments);
    } else {
      return str;
    }
  }};
window.$resource = function(path: any, args: any) {
  return dorado.util.Resource.get.apply(dorado.util.Resource, arguments);
};
(function() {
  Date.parseFunctions = {count:0};
  Date.parseRegexes = [];
  Date.formatFunctions = {count:0};
  Date.prototype.formatDate = function(format: any) {
    if (Date.formatFunctions[format] == null) {
      Date.createNewFormat(format);
    }
    let func = Date.formatFunctions[format];
    return this[func]();
  };
  Date.createNewFormat = function(format: any) {
    let funcName = "format" + Date.formatFunctions.count++;
    Date.formatFunctions[format] = funcName;
    
    // CSP 兼容：使用解释器模式，不动态生成代码
    let tokens: any[] = [];
    let special = false;
    for (let i = 0; i < format.length; ++i) {
      let ch = format.charAt(i);
      if (!special && ch === "\\") {
        special = true;
      } else {
        if (special) {
          special = false;
          tokens.push({type: 'literal', value: ch});
        } else {
          tokens.push({type: 'format', char: ch});
        }
      }
    }
    
    Date.prototype[funcName] = function() {
      let result = "";
      for (let token of tokens) {
        if (token.type === 'literal') {
          result += token.value;
        } else {
          result += Date.getFormatCodeValue(this, token.char);
        }
      }
      return result;
    };
  };
  Date.getFormatCode = function(character: any) {
    switch (character) {
      case "d":
        return "String.leftPad(this.getDate(), 2, '0') + ";
      case "D":
        return "getDayNames()[this.getDay()].substring(0, 3) + ";
      case "j":
        return "this.getDate() + ";
      case "l":
        return "getDayNames()[this.getDay()] + ";
      case "S":
        return "this.getSuffix() + ";
      case "w":
        return "this.getDay() + ";
      case "z":
        return "this.getDayOfYear() + ";
      case "W":
        return "this.getWeekOfYear() + ";
      case "F":
        return "getMonthNames()[this.getMonth()] + ";
      case "m":
        return "String.leftPad(this.getMonth() + 1, 2, '0') + ";
      case "M":
        return "getMonthNames()[this.getMonth()].substring(0, 3) + ";
      case "n":
        return "(this.getMonth() + 1) + ";
      case "t":
        return "this.getDaysInMonth() + ";
      case "L":
        return "(this.isLeapYear() ? 1 : 0) + ";
      case "Y":
        return "this.getFullYear() + ";
      case "y":
        return "('' + this.getFullYear()).substring(2, 4) + ";
      case "a":
        return "(this.getHours() < 12 ? 'am' : 'pm') + ";
      case "A":
        return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
      case "g":
        return "((this.getHours() %12) ? this.getHours() % 12 : 12) + ";
      case "G":
        return "this.getHours() + ";
      case "h":
        return "String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";
      case "H":
        return "String.leftPad(this.getHours(), 2, '0') + ";
      case "i":
        return "String.leftPad(this.getMinutes(), 2, '0') + ";
      case "s":
        return "String.leftPad(this.getSeconds(), 2, '0') + ";
      case "O":
        return "this.getGMTOffset() + ";
      case "T":
        return "this.getTimezone() + ";
      case "Z":
        return "(this.getTimezoneOffset() * -60) + ";
      default:
        return "'" + String.escape(character) + "' + ";
    }
  };
  
  // CSP 兼容：解释器模式的格式化函数
  Date.getFormatCodeValue = function(date: any, character: any) {
    switch (character) {
      case "d":
        return String.leftPad(date.getDate(), 2, '0');
      case "D":
        return getDayNames()[date.getDay()].substring(0, 3);
      case "j":
        return date.getDate();
      case "l":
        return getDayNames()[date.getDay()];
      case "S":
        return date.getSuffix();
      case "w":
        return date.getDay();
      case "z":
        return date.getDayOfYear();
      case "W":
        return date.getWeekOfYear();
      case "F":
        return getMonthNames()[date.getMonth()];
      case "m":
        return String.leftPad(date.getMonth() + 1, 2, '0');
      case "M":
        return getMonthNames()[date.getMonth()].substring(0, 3);
      case "n":
        return (date.getMonth() + 1);
      case "t":
        return date.getDaysInMonth();
      case "L":
        return (date.isLeapYear() ? 1 : 0);
      case "Y":
        return date.getFullYear();
      case "y":
        return ('' + date.getFullYear()).substring(2, 4);
      case "a":
        return (date.getHours() < 12 ? 'am' : 'pm');
      case "A":
        return (date.getHours() < 12 ? 'AM' : 'PM');
      case "g":
        return ((date.getHours() % 12) ? date.getHours() % 12 : 12);
      case "G":
        return date.getHours();
      case "h":
        return String.leftPad((date.getHours() % 12) ? date.getHours() % 12 : 12, 2, '0');
      case "H":
        return String.leftPad(date.getHours(), 2, '0');
      case "i":
        return String.leftPad(date.getMinutes(), 2, '0');
      case "s":
        return String.leftPad(date.getSeconds(), 2, '0');
      case "O":
        return date.getGMTOffset();
      case "T":
        return date.getTimezone();
      case "Z":
        return (date.getTimezoneOffset() * -60);
      default:
        return character;
    }
  };
  Date.parseDate = function(input: any, format: any) {
    if (Date.parseFunctions[format] == null) {
      Date.createParser(format);
    }
    let func = Date.parseFunctions[format];
    return Date[func](input);
  };
  Date.createParser = function(format: any) {
    let funcName = "parse" + Date.parseFunctions.count++;
    let regexNum = Date.parseRegexes.length;
    let currentGroup = 1;
    Date.parseFunctions[format] = funcName;
    
    // CSP 兼容：使用解释器模式，不动态生成代码
    let parseSteps: any[] = [];
    let regex = "";
    let special = false;
    
    for (let i = 0; i < format.length; ++i) {
      let ch = format.charAt(i);
      if (!special && ch === "\\") {
        special = true;
      } else {
        if (special) {
          special = false;
          regex += String.escape(ch);
        } else {
          let obj = Date.formatCodeToRegex(ch, currentGroup);
          currentGroup += obj.g;
          regex += obj.s;
          if (obj.g && obj.parseStep) {
            parseSteps.push(obj.parseStep);
          }
        }
      }
    }
    
    Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");
    
    // CSP 兼容：使用解释器执行解析
    Date[funcName] = function(input: any) {
      let results = input.match(Date.parseRegexes[regexNum]);
      if (!results || results.length === 0) return null;
      
      let y = -1, m = -1, d = -1, h = -1, i = -1, s = -1;
      
      // 执行解析步骤
      for (let step of parseSteps) {
        let groupIndex = step.group;
        let value = parseInt(results[groupIndex], 10);
        switch (step.field) {
          case 'y': y = value; break;
          case 'm': m = value - 1; break;
          case 'd': d = value; break;
          case 'h': h = value; break;
          case 'i': i = value; break;
          case 's': s = value; break;
        }
      }
      
      // 处理默认值
      if ((h >= 0 || i >= 0 || s >= 0) && (y < 0 || m < 0 || d < 0)) {
        let now = new Date();
        if (y < 0) y = now.getFullYear();
        if (m < 0) m = now.getMonth();
        if (d < 0) d = now.getDate();
      }
      
      // 构建日期
      let retval = null;
      if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0) {
        retval = new Date(y, m, d, h, i, s);
      } else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0) {
        retval = new Date(y, m, d, h, i);
      } else if (y > 0 && m >= 0 && d > 0 && h >= 0) {
        retval = new Date(y, m, d, h);
      } else if (y > 0 && m >= 0 && d > 0) {
        retval = new Date(y, m, d);
      } else if (y > 0 && m >= 0) {
        retval = new Date(y, m);
      } else if (y > 0) {
        retval = new Date(y);
      }
      
      // 验证
      if (retval) {
        if (s >= 0 && s !== retval.getSeconds() || 
            i >= 0 && i !== retval.getMinutes() || 
            h >= 0 && h !== retval.getHours() || 
            d >= 0 && d !== retval.getDate() || 
            m >= 0 && m !== retval.getMonth()) {
          retval = null;
        }
      }
      
      return retval;
    };
  };
  Date.formatCodeToRegex = function(character: any, currentGroup: any) {
    switch (character) {
      case "D":
        return {g:0, c:null, s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};
      case "j":
      case "d":
        return {g:1, c:"d = parseInt(results[" + currentGroup + "], 10);\n", s:"(\\d{1,2})"};
      case "l":
        return {g:0, c:null, s:"(?:" + getDayNames().join("|") + ")"};
      case "S":
        return {g:0, c:null, s:"(?:st|nd|rd|th)"};
      case "w":
        return {g:0, c:null, s:"\\d"};
      case "z":
        return {g:0, c:null, s:"(?:\\d{1,3})"};
      case "W":
        return {g:0, c:null, s:"(?:\\d{2})"};
      case "F":
        return {g:1, c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 3)], 10);\n", s:"(" + getMonthNames().join("|") + ")"};
      case "M":
        return {g:1, c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "]], 10);\n", s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};
      case "n":
      case "m":
        return {g:1, c:"m = parseInt(results[" + currentGroup + "], 10) - 1;\n", s:"(\\d{1,2})"};
      case "t":
        return {g:0, c:null, s:"\\d{1,2}"};
      case "L":
        return {g:0, c:null, s:"(?:1|0)"};
      case "Y":
        return {g:1, c:"y = parseInt(results[" + currentGroup + "], 10);\n", s:"(\\d{1,4})"};
      case "y":
        return {g:1, c:"let ty = parseInt(results[" + currentGroup + "], 10);\n" + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n", s:"(\\d{1,2})"};
      case "a":
        return {g:1, c:"if (results[" + currentGroup + "] === 'am') {\n" + "if (h === 12) { h = 0; }\n" + "} else { if (h < 12) { h += 12; }}", s:"(am|pm)"};
      case "A":
        return {g:1, c:"if (results[" + currentGroup + "] === 'AM') {\n" + "if (h === 12) { h = 0; }\n" + "} else { if (h < 12) { h += 12; }}", s:"(AM|PM)"};
      case "g":
      case "G":
      case "h":
      case "H":
        return {g:1, c:"h = parseInt(results[" + currentGroup + "], 10);\n", s:"(\\d{1,2})"};
      case "i":
        return {g:1, c:"i = parseInt(results[" + currentGroup + "], 10);\n", s:"(\\d{2})"};
      case "s":
        return {g:1, c:"s = parseInt(results[" + currentGroup + "], 10);\n", s:"(\\d{2})"};
      case "O":
        return {g:0, c:null, s:"[+-]\\d{4}"};
      case "T":
        return {g:0, c:null, s:"[A-Z]{3}"};
      case "Z":
        return {g:0, c:null, s:"[+-]\\d{1,5}"};
      default:
        return {g:0, c:null, s:String.escape(character)};
    }
  };
  Date.prototype.getTimezone = function() {
    return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(/^.*? [0-9]{4}.* \(([A-Z]{3})\)$/g, "$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3");
  };
  Date.prototype.getGMTOffset = function() {
    return (this.getTimezoneOffset() > 0 ? "-" : "+") + String.leftPad(Math.floor(Math.abs(this.getTimezoneOffset() / 60)), 2, "0") + String.leftPad(this.getTimezoneOffset() % 60, 2, "0");
  };
  Date.prototype.getDayOfYear = function() {
    let num = 0;
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    for (let i = 0; i < this.getMonth(); ++i) {
      num += Date.daysInMonth[i];
    }
    return num + this.getDate() - 1;
  };
  Date.prototype.getWeekOfYear = function() {
    let now = this.getDayOfYear() + (4 - this.getDay());
    let jan1 = new Date(this.getFullYear(), 0, 1);
    let then = (7 - jan1.getDay() + 4);
    return String.leftPad(((now - then) / 7) + 1, 2, "0");
  };
  Date.prototype.isLeapYear = function() {
    let year = this.getFullYear();
    return ((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
  };
  Date.prototype.getFirstDayOfMonth = function() {
    let day = (this.getDay() - (this.getDate() - 1)) % 7;
    return (day < 0) ? (day + 7) : day;
  };
  Date.prototype.getLastDayOfMonth = function() {
    let day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
    return (day < 0) ? (day + 7) : day;
  };
  Date.prototype.getDaysInMonth = function() {
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    return Date.daysInMonth[this.getMonth()];
  };
  Date.prototype.getSuffix = function() {
    switch (this.getDate()) {
      case 1:
      case 21:
      case 31:
        return "st";
      case 2:
      case 22:
        return "nd";
      case 3:
      case 23:
        return "rd";
      default:
        return "th";
    }
  };
  String.escape = function(string: any) {
    return string.replace(/('|\\)/g, "\\$1");
  };
  String.leftPad = function(val: any, size: any, ch: any) {
    let result = new String(val);
    if (ch == null) {
      ch = " ";
    }
    while (result.length < size) {
      result = ch + result;
    }
    return result;
  };
  Date.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  Date.y2kYear = 50;
  Date.monthNumbers = {Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11};
  Date.patterns = {ISO8601LongPattern:"Y-m-d H:i:s", ISO8601ShortPattern:"Y-m-d", ShortDatePattern:"n/j/Y", LongDatePattern:"l, F d, Y", FullDateTimePattern:"l, F d, Y g:i:s A", MonthDayPattern:"F d", ShortTimePattern:"g:i A", LongTimePattern:"g:i:s A", SortableDateTimePattern:"Y-m-d\\TH:i:s", UniversalSortableDateTimePattern:"Y-m-d H:i:sO", YearMonthPattern:"F, Y"};
  function getMonthNames() {
    if (!Date.monthNames) {
      Date.monthNames = ($resource("dorado.core.AllMonths") || "January,February,March,April,May,June,July,August,September,October,November,December").split(",");
    }
    return Date.monthNames;
  }
  function getDayNames() {
    if (!Date.dayNames) {
      Date.dayNames = ($resource("dorado.core.AllWeeks") || "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday").split(",");
    }
    return Date.dayNames;
  }
})();
dorado.util.Common = {URL_VARS:{}, concatURL:function() {
    let url = "";
    for (let i = 0; i < arguments.length; i++) {
      let section = arguments[i];
      if (typeof section === "string" && section) {
        section = jQuery.trim(section);
        let e = (url.charAt(url.length - 1) === "/");
        let s = (section.charAt(0) === "/");
        if (s === e) {
          if (s) {
            url += section.substring(1);
          } else {
            url += "/" + section;
          }
        } else {
          url += section;
        }
      }
    }
    return url;
  }, translateURL:function(url: any) {
    if (!url) {
      return url;
    }
    let reg = /^.+\>/, m = url.match(reg);
    if (m) {
      m = m[0];
      let varName = m.substring(0, m.length - 1);
      if (varName.charAt(0) === ">") {
        varName = varName.substring(1);
      }
      let s1 = this.URL_VARS[varName] || "", s2 = url.substring(m.length);
      url = this.concatURL(s1, s2);
    } else {
      if (url.charAt(0) === ">") {
        url = this.concatURL($setting["common.contextPath"], url.substring(1));
      }
    }
    return url;
  }, parseExponential:function(n: any) {
    n = n + "";
    let cv = n.split("e-");
    let leadingZero = "";
    let fl = parseInt(cv[1]);
    for (let i = 0; fl > 1 && i < fl - 1; i++) {
      leadingZero += "0";
    }
    let es = cv[0];
    let pi = es.indexOf(".");
    if (pi > 0) {
      es = es.substring(0, pi) + es.substring(pi + 1);
    }
    n = "0." + leadingZero + es;
    return n;
  }, formatFloat:function(n: any, format: any) {
    function formatInt(n: any, format: any, dec: any) {
      if (!format) {
        return (parseInt(n.substring(0, nfs.length), 10) + 1) + "";
      }
      let c, f, r = "", j = 0, prefix = "";
      let fv = format.split("");
      for (let i = 0; i < fv.length; i++) {
        f = fv[i];
        if (f === "#" || f === "0" || f === "`") {
          fv = fv.slice(i);
          break;
        }
        prefix += f;
      }
      fv = fv.reverse();
      let cv = n.split("").reverse();
      for (let i = 0; i < fv.length; i++) {
        f = fv[i];
        if (f === "#") {
          if (j < cv.length) {
            if (n === "0") {
              j = cv.length;
            } else {
              if (n === "-0") {
                if (dec) {
                  r += "-";
                }
                j = cv.length;
              } else {
                r += cv[j++];
              }
            }
          }
        } else {
          if (f === "0") {
            if (j < cv.length) {
              r += cv[j++];
            } else {
              r += f;
            }
          } else {
            if (f === "`") {
              let commaCount = 3;
              while (j < cv.length) {
                let c = cv[j++];
                if (commaCount === 3 && c !== "-") {
                  r += ",";
                  commaCount = 0;
                }
                r += c;
                commaCount++;
              }
            } else {
              r += f;
            }
          }
        }
      }
      while (j < cv.length) {
        r += cv[j++];
      }
      return prefix + r.split("").reverse().join("");
    }
    function formatDecimal(n: any, format: any) {
      let nfs = (format) ? format.match(/[\#0]/g) : null;
      if (nfs == null) {
        return [format, (n && n.charAt(0) > "4")];
      } else {
        if (n && n.length > nfs.length && n.charAt(nfs.length) > "4") {
          let n = n.substring(0, nfs.length);
          n = (parseInt(n, 10) + 1) + "";
          let overflow = n.length > nfs.length;
          if (overflow) {
            n = n.substring(n.length - nfs.length);
          } else {
            let leadingZero = "";
            for (let i = n.length; i < nfs.length; i++) {
              leadingZero += "0";
            }
            n = leadingZero + n;
          }
        }
      }
      let f, r = "", j = 0;
      for (let i = 0; i < format.length; i++) {
        f = format.charAt(i);
        if (f === "#" || f === "0") {
          if (n && j < n.length) {
            r += n.charAt(j++);
          } else {
            if (f === "0") {
              r += f;
            }
          }
        } else {
          r += f;
        }
      }
      return [r, overflow];
    }
    if (n == null || isNaN(n)) {
      return "";
    }
    n = n + "";
    if (n.indexOf("e-") > 0) {
      n = dorado.util.Common.parseExponential(n);
    }
    if (!format) {
      return n;
    }
    let n1, n2, f1, f2, f3 = "", i;
    i = n.indexOf(".");
    if (i > 0) {
      n1 = n.substring(0, i);
      n2 = n.substring(i + 1);
    } else {
      n1 = n;
    }
    i = format.indexOf(".");
    if (i > 0) {
      f1 = format.substring(0, i);
      f2 = format.substring(i + 1);
      let j = 0;
      for (j = 0; j < f2.length; j++) {
        let c = f2.charAt(j);
        if (c !== "#" && c !== "0") {
          break;
        }
      }
      if (j > 0) {
        f3 = f2.substring(j);
        f2 = f2.substring(0, j);
      }
    } else {
      f1 = format;
    }
    f1 = f1.replace(/\#,/g, "`");
    let r = formatDecimal(n2, f2);
    let dec = r[0];
    if (r[1]) {
      n1 = (parseInt(n1, 10) + ((n1.charAt(0) === "-") ? -1 : 1)) + "";
    }
    return formatInt(n1, f1, dec) + ((dec) ? ("." + dec) : "") + f3;
  }, parseFloat:function(s: any) {
    if (s === 0) {
      return 0;
    }
    if (!s) {
      return Number.NaN;
    }
    s = s + "";
    if (s.indexOf("e-") > 0) {
      s = dorado.util.Common.parseExponential(s);
    }
    let ns = s.match(/[-\d\.]/g);
    if (!ns) {
      return Number.NaN;
    }
    let n = parseFloat(ns.join(""));
    if (n > 9007199254740991) {
      throw new dorado.ResourceException("dorado.data.ErrorNumberOutOfRangeG");
    } else {
      if (n < -9007199254740991) {
        throw new dorado.ResourceException("dorado.data.ErrorNumberOutOfRangeL");
      }
    }
    return n;
  }, _classTypeCache:{}, getClassType:function(type: any, silence: any) {
    let classType = null;
    try {
      classType = this._classTypeCache[type];
      if (classType === undefined) {
        let path = type.split("."), obj = window, i = 0, len = path.length;
        for (; i < len && obj; i++) {
          obj = obj[path[i]];
        }
        if (i === len) {
          classType = obj;
        }
        this._classTypeCache[type] = (classType || null);
      }
    }
    catch (e) {
      if (!silence) {
        throw new dorado.ResourceException("dorado.core.UnknownType", type);
      }
    }
    return classType;
  }, singletonInstance:{}, getSingletonInstance:function(factory: any) {
    let typeName;
    if (typeof factory === "string") {
      typeName = factory;
    } else {
      typeName = factory._singletonId;
      if (!typeName) {
        factory._singletonId = typeName = dorado.Core.newId();
      }
    }
    let instance = this.singletonInstance[typeName];
    if (!instance) {
      if (typeof factory === "string") {
        let classType = dorado.util.Common.getClassType(typeName);
        instance = new classType();
      } else {
        instance = new factory();
      }
      this.singletonInstance[typeName] = instance;
    }
    return instance;
  }};
window.$url = function(url: any) {
  return dorado.util.Common.translateURL(url);
};
dorado.util.Common.URL_VARS.skin = $url($setting["widget.skinRoot"] + ($setting["widget.skin"] ? ($setting["widget.skin"] + "/") : ""));
window.$singleton = function(factory: any) {
  return dorado.util.Common.getSingletonInstance(factory);
};
(function() {
  dorado.util.Iterator = $class({$className:"dorado.util.Iterator", first:dorado._NULL_FUNCTION, last:dorado._NULL_FUNCTION, hasPrevious:dorado._NULL_FUNCTION, hasNext:dorado._NULL_FUNCTION, previous:dorado._NULL_FUNCTION, next:dorado._NULL_FUNCTION, current:dorado._NULL_FUNCTION, createBookmark:dorado._UNSUPPORTED_FUNCTION(), restoreBookmark:dorado._UNSUPPORTED_FUNCTION()});
  dorado.util.ArrayIterator = $extend(dorado.util.Iterator, {$className:"dorado.util.ArrayIterator", constructor:function(v: any, nextIndex: any) {
      this._v = v;
      this._current = (nextIndex || 0) - 1;
    }, first:function() {
      this._current = -1;
    }, last:function() {
      this._current = this._v.length;
    }, hasPrevious:function() {
      return this._current > 0;
    }, hasNext:function() {
      return this._current < (this._v.length - 1);
    }, previous:function() {
      return (this._current < 0) ? null : this._v[--this._current];
    }, next:function() {
      return (this._current >= this._v.length) ? null : this._v[++this._current];
    }, current:function() {
      return this._v[this._current];
    }, setNextIndex:function(nextIndex: any) {
      this._current = nextIndex - 1;
    }, createBookmark:function() {
      return this._current;
    }, restoreBookmark:function(bookmark: any) {
      this._current = bookmark;
    }});
})();
dorado.util.KeyedArray = $class({$className:"dorado.util.KeyedArray", constructor:function(getKeyFunction: any) {
    this.items = [];
    this._keyMap = {};
    this._getKeyFunction = getKeyFunction;
  }, size:0, _getKey:function(data: any) {
    let key = this._getKeyFunction ? this._getKeyFunction(data) : data.id;
    return (typeof key === "string") ? key : (key + "");
  }, insert:function(data: any, insertMode: any, refData: any) {
    let ctx;
    if (this.beforeInsert) {
      ctx = this.beforeInsert(data);
    }
    if (!isFinite(insertMode) && insertMode) {
      switch (insertMode) {
        case "begin":
          insertMode = 0;
          break;
        case "before":
          insertMode = this.items.indexOf(refData);
          if (insertMode < 0) {
            insertMode = 0;
          }
          break;
        case "after":
          insertMode = this.items.indexOf(refData) + 1;
          if (insertMode >= this.items.length) {
            insertMode = null;
          }
          break;
        default:
          insertMode = null;
          break;
      }
    }
    if (insertMode != null && isFinite(insertMode) && insertMode >= 0) {
      this.items.insert(data, insertMode);
    } else {
      this.items.push(data);
    }
    this.size++;
    let key = this._getKey(data);
    if (key) {
      this._keyMap[key] = data;
    }
    if (this.afterInsert) {
      this.afterInsert(data, ctx);
    }
  }, append:function(data: any) {
    this.insert(data);
  }, remove:function(data: any) {
    let ctx;
    if (this.beforeRemove) {
      ctx = this.beforeRemove(data);
    }
    let i = this.items.remove(data);
    if (i >= 0) {
      this.size--;
      let key = this._getKey(data);
      if (key) {
        delete this._keyMap[key];
      }
    }
    if (this.afterRemove) {
      this.afterRemove(data, ctx);
    }
    return i;
  }, removeAt:function(i: any) {
    if (i >= 0 && i < this.size) {
      let data = this.items[i], ctx;
      if (data) {
        if (this.beforeRemove) {
          ctx = this.beforeRemove(data);
        }
        let key = this._getKey(data);
        if (key) {
          delete this._keyMap[key];
        }
      }
      this.items.removeAt(i);
      this.size--;
      if (data && this.afterRemove) {
        this.afterRemove(data, ctx);
      }
      return data;
    }
    return null;
  }, removeKey:function(key: any) {
    let ctx, data = this._keyMap[key];
    if (this.beforeRemove) {
      ctx = this.beforeRemove(data);
    }
    let i = this.items.remove(data);
    if (i >= 0) {
      this.size--;
      if (key) {
        delete this._keyMap[key];
      }
    }
    if (this.afterRemove) {
      this.afterRemove(data, ctx);
    }
    return data;
  }, indexOf:function(data: any) {
    return this.items.indexOf(data);
  }, replace:function(oldData: any, newData: any) {
    let i = this.indexOf(oldData);
    if (i >= 0) {
      this.removeAt(i);
      this.insert(newData, i);
    }
    return i;
  }, get:function(k: any) {
    return (typeof k === "number") ? this.items[k] : this._keyMap[k];
  }, clear:function() {
    for (let i = this.size - 1; i >= 0; i--) {
      this.removeAt(i);
    }
  }, iterator:function(from: any) {
    let start = this.items.indexOf(from);
    if (start < 0) {
      start = 0;
    }
    return new dorado.util.ArrayIterator(this.items, start);
  }, each:function(fn: any, scope: any) {
    let array = this.items;
    for (let i = 0; i < array.length; i++) {
      if (fn.call(scope || array[i], array[i], i) === false) {
        return i;
      }
    }
  }, toArray:function() {
    return this.items.slice(0);
  }, clone:function() {
    let cloned = dorado.Core.clone(this);
    cloned.items = dorado.Core.clone(this.items);
    cloned._keyMap = dorado.Core.clone(this._keyMap);
    return cloned;
  }, deepClone:function() {
    let cloned = new dorado.util.KeyedArray(this._getKeyFunction);
    for (let i = 0; i < this.items.length; i++) {
      cloned.append(dorado.Core.clone(this.items[i]));
    }
    return cloned;
  }});
dorado.util.KeyedList = $class({$className:"dorado.util.KeyedList", constructor:function(getKeyFunction: any) {
    this._keyMap = {};
    this._getKeyFunction = getKeyFunction;
  }, size:0, _getKey:function(data: any) {
    let key = this._getKeyFunction ? this._getKeyFunction(data) : data.id;
    return (typeof key === "string") ? key : (key + "");
  }, _registerEntry:function(entry: any) {
    let key = this._getKey(entry.data);
    if (key != null) {
      this._keyMap[key] = entry;
    }
  }, _unregisterEntry:function(entry: any) {
    let key = this._getKey(entry.data);
    if (key != null) {
      delete this._keyMap[key];
    }
  }, _unregisterAllEntries:function() {
    this._keyMap = {};
  }, insertEntry:function(entry: any, insertMode: any, refEntry: any) {
    let e1, e2;
    switch (insertMode) {
      case "begin":
        e1 = null;
        e2 = this.first;
        break;
      case "before":
        e1 = (refEntry) ? refEntry.previous : null;
        e2 = refEntry;
        break;
      case "after":
        e1 = refEntry;
        e2 = (refEntry) ? refEntry.next : null;
        break;
      default:
        e1 = this.last;
        e2 = null;
        break;
    }
    entry.previous = e1;
    entry.next = e2;
    if (e1) {
      e1.next = entry;
    } else {
      this.first = entry;
    }
    if (e2) {
      e2.previous = entry;
    } else {
      this.last = entry;
    }
    this._registerEntry(entry);
    this.size++;
  }, removeEntry:function(entry: any) {
    let e1, e2;
    e1 = entry.previous;
    e2 = entry.next;
    if (e1) {
      e1.next = e2;
    } else {
      this.first = e2;
    }
    if (e2) {
      e2.previous = e1;
    } else {
      this.last = e1;
    }
    this._unregisterEntry(entry);
    this.size--;
  }, findEntry:function(data: any) {
    if (data == null) {
      return null;
    }
    let key = this._getKey(data);
    if (key != null) {
      return this._keyMap[key];
    } else {
      let entry = this.first;
      while (entry) {
        if (entry.data === data) {
          return entry;
        }
        entry = entry.next;
      }
    }
    return null;
  }, findEntryByKey:function(key: any) {
    return this._keyMap[key];
  }, insert:function(data: any, insertMode: any, refData: any) {
    let refEntry = null;
    if (refData != null) {
      refEntry = this.findEntry(refData);
    }
    let entry = {data:data};
    this.insertEntry(entry, insertMode, refEntry);
  }, append:function(data: any) {
    this.insert(data);
  }, remove:function(data: any) {
    let entry = this.findEntry(data);
    if (entry != null) {
      this.removeEntry(entry);
    }
    return (entry != null);
  }, removeKey:function(key: any) {
    let entry = this._keyMap[key];
    if (entry) {
      this.removeEntry(entry);
      return entry.data;
    }
    return null;
  }, get:function(key: any) {
    let entry = this._keyMap[key];
    if (entry) {
      return entry.data;
    }
    return null;
  }, clear:function() {
    let entry = this.first;
    while (entry) {
      if (entry.data) {
        delete entry.data;
      }
      entry = entry.next;
    }
    this._unregisterAllEntries();
    this.first = null;
    this.last = null;
    this.size = 0;
  }, iterator:function(from: any) {
    return new dorado.util.KeyedListIterator(this, from);
  }, each:function(fn: any, scope: any) {
    let entry = this.first, i = 0;
    while (entry != null) {
      if (fn.call(scope || entry.data, entry.data, i++) === false) {
        break;
      }
      entry = entry.next;
    }
  }, toArray:function() {
    let v = [], entry = this.first;
    while (entry != null) {
      v.push(entry.data);
      entry = entry.next;
    }
    return v;
  }, getFirst:function() {
    return this.first ? this.first.data : null;
  }, getLast:function() {
    return this.last ? this.last.data : null;
  }, clone:function() {
    let cloned = new dorado.util.KeyedList(this._getKeyFunction);
    let entry = this.first;
    while (entry != null) {
      cloned.append(entry.data);
      entry = entry.next;
    }
    return cloned;
  }, deepClone:function() {
    let cloned = new dorado.util.KeyedList(this._getKeyFunction);
    let entry = this.first;
    while (entry != null) {
      cloned.append(dorado.Core.clone(entry.data));
      entry = entry.next;
    }
    return cloned;
  }});
dorado.util.KeyedListIterator = $extend(dorado.util.Iterator, {$className:"dorado.util.KeyedListIterator", constructor:function(list: any, from: any) {
    this._list = list;
    this.current = null;
    if (from) {
      this.current = list.findEntry(from);
    }
    this.isFirst = (this.current == null);
    this.isLast = false;
  }, first:function() {
    this.isFirst = true;
    this.isLast = false;
    this.current = null;
  }, last:function() {
    this.isFirst = false;
    this.isLast = true;
    this.current = null;
  }, hasNext:function() {
    if (this.isFirst) {
      return (this._list.first != null);
    } else {
      if (this.current != null) {
        return (this.current.next != null);
      } else {
        return false;
      }
    }
  }, hasPrevious:function() {
    if (this.isLast) {
      return (this._list.last != null);
    } else {
      if (this.current != null) {
        return (this.current.previous != null);
      } else {
        return false;
      }
    }
  }, next:function() {
    let current = this.current;
    if (this.isFirst) {
      current = this._list.first;
    } else {
      if (current != null) {
        current = current.next;
      } else {
        current = null;
      }
    }
    this.current = current;
    this.isFirst = false;
    if (current != null) {
      this.isLast = false;
      return current.data;
    } else {
      this.isLast = true;
      return null;
    }
  }, previous:function() {
    let current = this.current;
    if (this.isLast) {
      current = this._list.last;
    } else {
      if (current != null) {
        current = current.previous;
      } else {
        current = null;
      }
    }
    this.current = current;
    this.isLast = false;
    if (current != null) {
      this.isFirst = false;
      return current.data;
    } else {
      this.isFirst = true;
      return null;
    }
  }, current:function() {
    return (this.current) ? this.current.data : null;
  }, createBookmark:function() {
    return {isFirst:this.isFirst, isLast:this.isLast, current:this.current};
  }, restoreBookmark:function(bookmark: any) {
    this.isFirst = bookmark.isFirst;
    this.isLast = bookmark.isLast;
    this.current = bookmark.current;
  }});
dorado.util.ObjectPool = $class({$className:"dorado.util.ObjectPool", constructor:function(factory: any) {
    dorado.util.ObjectPool.OBJECT_POOLS.push(this);
    this._factory = factory;
    this._idlePool = [];
    this._activePool = [];
  }, borrowObject:function() {
    let object = null;
    let factory = this._factory;
    if (this._idlePool.length > 0) {
      object = this._idlePool.pop();
    } else {
      object = factory.makeObject();
    }
    if (object != null) {
      this._activePool.push(object);
      if (factory.activateObject) {
        factory.activateObject(object);
      }
    }
    return object;
  }, returnObject:function(object: any) {
    if (object != null) {
      let factory = this._factory;
      let i = this._activePool.indexOf(object);
      if (i < 0) {
        return;
      }
      if (factory.passivateObject) {
        factory.passivateObject(object);
      }
      this._activePool.removeAt(i);
      this._idlePool.push(object);
    }
  }, getNumActive:function() {
    return this._activePool.length;
  }, getNumIdle:function() {
    return this._idlePool.length;
  }, destroy:function() {
    if (!!this._destroyed) {
      return;
    }
    let factory = this._factory;
    function returnObject(object: any) {
      if (factory.passivateObject) {
        factory.passivateObject(object);
      }
    }
    function destroyObject(object: any) {
      if (factory.destroyObject) {
        factory.destroyObject(object);
      }
    }
    let activePool = this._activePool;
    for (let i = 0; i < activePool.length; i++) {
      let object = activePool[i];
      returnObject(object);
      destroyObject(object);
    }
    let idlePool = this._idlePool;
    for (let i = 0; i < idlePool.length; i++) {
      let object = idlePool[i];
      destroyObject(object);
    }
    this._factory = null;
    this._destroyed = true;
  }});
dorado.util.ObjectPool.OBJECT_POOLS = [];
(function() {
  function f(n: any) {
    return n < 10 ? "0" + n : n;
  }
  Date.prototype.toJSON = function(key: any) {
    return this.getFullYear() + "-" + f(this.getMonth() + 1) + "-" + f(this.getDate()) + "T" + f(this.getHours()) + ":" + f(this.getMinutes()) + ":" + f(this.getSeconds()) + "Z";
  };
  dorado.JSON = {parse:function(text: any, untrusty: any) {
      // CSP 兼容：统一使用 JSON.parse，不再使用 eval
      return text ? JSON.parse(text) : null;
    }, stringify:function(value: any, options: any) {
        if (value instanceof dorado.Entity || value instanceof dorado.EntityList) {
          value = value.toJSON(options);
        }
        return JSON.stringify(value, (options != null) ? options.replacer : null);
    }, evaluate:function(template: any) {
      function toJSON(obj: any) {
        if (typeof obj === "function") {
          obj = obj.call(dorado.$this || this);
        } else {
          if (obj instanceof dorado.util.Map) {
            obj = obj.toJSON();
          }
        }
        let json;
        if (obj instanceof dorado.Entity || obj instanceof dorado.EntityList) {
          json = obj.toJSON({generateDataType:true});
        } else {
          if (obj instanceof Array) {
            json = [];
            for (let i = 0; i < obj.length; i++) {
              json.push(toJSON(obj[i]));
            }
          } else {
            if (obj instanceof Object && !(obj instanceof Date)) {
              if (typeof obj.toJSON === "function") {
                json = obj.toJSON();
              } else {
                json = {};
                for (let p in obj) {
                  if (obj.hasOwnProperty(p)) {
                    v = obj[p];
                    if (v === undefined) {
                      continue;
                    }
                    if (v != null) {
                      v = toJSON.call(obj, v);
                    }
                    json[p] = v;
                  }
                }
              }
            } else {
              json = obj;
            }
          }
        }
        return json;
      }
      return toJSON(template);
    }};
})();
dorado.util.AjaxConnectionPool = new dorado.util.ObjectPool({activeX:["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], _createXMLHttpRequest:function() {
    try {
      return new XMLHttpRequest();
    }
    catch (e) {
      for (let i = 0; i < this.activeX.length; ++i) {
        try {
          return new ActiveXObject(this.activeX[i]);
        }
        catch (e) {
        }
      }
    }
  }, makeObject:function() {
    return {conn:this._createXMLHttpRequest()};
  }, passivateObject:function(connObj: any) {
    delete connObj.url;
    delete connObj.method;
    delete connObj.options;
    let conn = connObj.conn;
    conn.onreadystatechange = dorado._NULL_FUNCTION;
    conn.abort();
  }});
dorado.util.AjaxEngine = $extend([dorado.AttributeSupport, dorado.EventSupport], {$className:"dorado.util.AjaxEngine", constructor:function(options: any) {
    this._requests = [];
    this._connectionPool = dorado.util.AjaxConnectionPool;
    $invokeSuper.call(this);
    if (options) {
      this.set(options);
    }
  }, ATTRIBUTES:{defaultOptions:{writeOnce:true}, autoBatchEnabled:{setter:function(value: any) {
        if (value && !(this._defaultOptions && this._defaultOptions.url)) {
          throw new dorado.ResourceException("dorado.core.BatchUrlUndefined");
        }
        this._autoBatchEnabled = value;
      }}, minConnectInterval:{defaultValue:20}, maxBatchSize:{defaultValue:20}}, EVENTS:{beforeRequest:{}, onResponse:{}, beforeConnect:{}, onDisconnect:{}}, request:function(options: any, callback: any) {
    if (typeof options === "string") {
      options = {url:options};
    }
    let id = dorado.Core.newId();
    dorado.util.AjaxEngine.ASYNC_REQUESTS[id] = true;
    let callbackWrapper = {callback:function(success: any, result: any) {
        let timerId = dorado.util.AjaxEngine.ASYNC_REQUESTS[id];
        if (timerId) {
          if (typeof timerId === "number") {
            clearTimeout(timerId);
          }
          delete dorado.util.AjaxEngine.ASYNC_REQUESTS[id];
          $callback(callback, success, result);
        }
      }};
    let useBatch = this._autoBatchEnabled && (options.batchable === true);
    if (useBatch) {
      if (options) {
        if (options.url && options.url !== this._defaultOptions.url || options.method && options.method !== "POST" || options.timeout) {
          useBatch = false;
        }
        if (useBatch && options.headers) {
          for (let prop in options.headers) {
            if (options.headers.hasOwnProperty(prop)) {
              useBatch = false;
              break;
            }
          }
        }
      }
      let requests = this._requests;
      if (requests.length === 0) {
        this._batchTimerId = $setTimeout(this, function() {
          this._requestBatch(true);
        }, this._minConnectInterval);
        this._oldestPendingRequestTime = new Date();
        dorado.util.AjaxEngine.INSTANCES_PENDING_REQUESTS.push(this);
      }
      this.fireEvent("beforeRequest", this, {async:true, options:options});
      let message = options.message, taskId;
      if (message && message !== "none") {
        taskId = dorado.util.TaskIndicator.showTaskIndicator(message, options.modal ? "main" : "daemon");
      }
      if (callback && options && options.timeout) {
        dorado.util.AjaxEngine.ASYNC_REQUESTS[id] = $setTimeout(this, function() {
          let result = new dorado.util.AjaxResult(options);
          result._setException(new dorado.util.AjaxTimeoutException($resource("dorado.core.AsyncRequestTimeout", options.timeout)));
          $callback(callbackWrapper, false, result, {scope:this});
        }, options.timeout);
      }
      requests.push({options:options, callback:callbackWrapper, taskId:taskId});
      if (requests.length >= this._maxBatchSize) {
        this._requestBatch(true);
      }
    } else {
      this.requestAsync(options, callbackWrapper);
    }
  }, _requestBatch:function(force: any) {
    if (!force) {
      if (this._oldestPendingRequestTime && (new Date() - this._oldestPendingRequestTime) < this._minConnectInterval) {
        return;
      }
    }
    if (this._batchTimerId) {
      clearTimeout(this._batchTimerId);
      this._batchTimerId = 0;
    }
    let requests = this._requests;
    if (requests.length === 0) {
      return;
    }
    this._requests = [];
    this._oldestPendingRequestTime = 0;
    dorado.util.AjaxEngine.INSTANCES_PENDING_REQUESTS.remove(this);
    let batchCallback = {scope:this, callback:function(success: any, batchResult: any) {
        function createAjaxResult(options: any) {
          let result = new dorado.util.AjaxResult(options);
          result._init(batchResult._connObj);
          return result;
        }
        if (success) {
          let xmlDoc = jQuery(batchResult.getXmlDocument());
          let i = 0;
          let that = this;
          xmlDoc.find("result>request").each($scopify(this, function(index: any, elem: any) {
            let request = requests[i];
            if (request.taskId) {
              dorado.util.TaskIndicator.hideTaskIndicator(request.taskId);
            }
            let result = createAjaxResult(request.options);
            let el = jQuery(elem);
            let exceptionEl = el.children("exception");
            let success = (exceptionEl.length === 0);
            if (success) {
              let responseEl = el.children("response");
              result.text = responseEl.text();
            } else {
              result.text = exceptionEl.text();
              if (exceptionEl.attr("type") === "runnable") {
                result._parseRunnableException(result.text);
              } else {
                result._setException(result._parseException(result.text, batchResult._connObj));
              }
            }
            $callback(request.callback, success, result);
            that.fireEvent("onResponse", this, {async:true, result:result});
            i++;
          }));
        } else {
          for (let i = 0; i < requests.length; i++) {
            let request = requests[i];
            if (request.taskId) {
              dorado.util.TaskIndicator.hideTaskIndicator(request.taskId);
            }
            let result = createAjaxResult(request.options);
            result._setException(batchResult.exception);
            $callback(request.callback, false, result);
            this.fireEvent("onResponse", this, {async:true, result:result});
          }
        }
      }};
    let sendData = ["<batch>\n"];
    for (let i = 0; i < requests.length; i++) {
      let request = requests[i];
      let options = request.options;
      let type = "";
      if (options) {
        if (options.xmlData) {
          type = "xml";
        } else {
          if (options.jsonData) {
            type = "json";
          }
        }
      }
      sendData.push("<request type=\"" + type + "\"><![CDATA[");
      let data = this._getSendData(options);
      if (data) {
        data = data.replace(/]]>/g, "]]]]><![CDATA[>");
      }
      sendData.push(data);
      sendData.push("]]></request>\n");
    }
    sendData.push("</batch>");
    let batchOptions = {isBatch:true, xmlData:sendData.join("")};
    this.requestAsync(batchOptions, batchCallback);
  }, requestAsync:function(options: any, callback: any) {
    let connObj = this._connectionPool.borrowObject();
    this._init(connObj, options, true);
    let eventArg = {async:true, options:options};
    if (options == null || !options.isBatch) {
      this.fireEvent("beforeRequest", this, eventArg);
    }
    this.fireEvent("beforeConnect", this, eventArg);
    let conn = connObj.conn;
    let message = options.message, taskId;
    if (message && message !== "none") {
      taskId = dorado.util.TaskIndicator.showTaskIndicator(message, options.modal ? "main" : "daemon");
    }
    if (callback && options && options.timeout) {
      connObj.timeoutTimerId = $setTimeout(this, function() {
        try {
          if (taskId) {
            dorado.util.TaskIndicator.hideTaskIndicator(taskId);
          }
          let result = new dorado.util.AjaxResult(options);
          try {
            result._init(connObj);
          }
          catch (e) {
          }
          result._setException(new dorado.util.AjaxTimeoutException($resource("dorado.core.AsyncRequestTimeout", options.timeout), null, connObj));
          $callback(callback, false, result, {scope:this});
          let eventArg = {async:true, result:result};
          this.fireEvent("onDisconnect", this, eventArg);
          if (options == null || !options.isBatch) {
            this.fireEvent("onResponse", this, eventArg);
          }
        }
        finally {
          this._connectionPool.returnObject(connObj);
        }
      }, options.timeout);
    }
    conn.onreadystatechange = $scopify(this, function() {
      if (conn.readyState === 4) {
        try {
          if (taskId) {
            dorado.util.TaskIndicator.hideTaskIndicator(taskId);
          }
          if (callback && options && options.timeout) {
            clearTimeout(connObj.timeoutTimerId);
          }
          let result = new dorado.util.AjaxResult(options, connObj);
          let eventArg = {async:true, result:result};
          this.fireEvent("onDisconnect", this, eventArg);
          $callback(callback, result.success, result, {scope:this});
          if (options == null || !options.isBatch) {
            this.fireEvent("onResponse", this, eventArg);
          }
        }
        finally {
          this._connectionPool.returnObject(connObj);
        }
      }
    });
    conn.send(this._getSendData(options));
  }, _setHeader:function(connObj: any, options: any) {
    function setHeaders(conn: any, headers: any) {
      if (!headers) {
        return;
      }
      for (let prop in headers) {
        if (headers.hasOwnProperty(prop)) {
          let value = headers[prop];
          if (value != null) {
            conn.setRequestHeader(prop, value);
          }
        }
      }
    }
    if (this._defaultOptions) {
      setHeaders(connObj.conn, this._defaultOptions.headers);
    }
    if (options) {
      setHeaders(connObj.conn, options.headers);
    }
  }, _init:function(connObj: any, options: any, async: any) {
    function urlAppend(url: any, p: any, s: any) {
      if (s) {
        return url + (url.indexOf("?") === -1 ? "?" : "&") + p + "=" + encodeURI(s);
      }
      return url;
    }
    let url, method;
    if (options) {
      url = options.url;
      method = options.method;
      if (!options.headers) {
        options.headers = {};
      }
      if (options.xmlData) {
        options.headers["content-type"] = "text/xml";
        method = "POST";
      } else {
        if (options.jsonData) {
          options.headers["content-type"] = "text/javascript";
          method = "POST";
        }
      }
    }
    let defaultOptions = (this._defaultOptions) ? this._defaultOptions : {};
    url = url || defaultOptions.url;
    method = method || defaultOptions.method || "GET";
    let parameter = options.parameter;
    if (parameter && (method === "GET" || options.xmlData || options.jsonData)) {
      if (typeof parameter === "string") {
        url += (url.indexOf("?") === -1 ? "?" : "&") + encodeURI(parameter);
      } else {
        for (let p in parameter) {
          if (parameter.hasOwnProperty(p)) {
            url = urlAppend(url, p, parameter[p]);
          }
        }
      }
    }
    connObj.url = url = $url(url);
    connObj.method = method;
    connObj.options = options;
    connObj.conn.open(method, url, async);
    this._setHeader(connObj, options);
  }, _getSendData:function(options: any) {
    if (!options) {
      return null;
    }
    let data = null;
    if (options.xmlData) {
      data = options.xmlData;
    } else {
      if (options.jsonData) {
        data = dorado.JSON.stringify(options.jsonData, {replacer:function(key: any, value: any) {
            return (typeof value === "function") ? value.call(this) : value;
          }});
      } else {
        if (options.parameter) {
          let parameter = options.parameter;
          data = "";
          let i = 0;
          for (let p in parameter) {
            if (parameter.hasOwnProperty(p)) {
              data += (i > 0 ? "&" : "") + p + "=" + encodeURI(parameter[p]);
              i++;
            }
          }
        }
      }
    }
    return data;
  }, requestSync:function(options: any, alwaysReturn: any) {
    if (typeof options === "string") {
      options = {url:options};
    }
    let connObj = this._connectionPool.borrowObject();
    try {
      let eventArg = {async:false, options:options};
      this.fireEvent("beforeRequest", this, eventArg);
      this.fireEvent("beforeConnect", this, eventArg);
      let exception = null;
      try {
        this._init(connObj, options, false);
        connObj.conn.send(this._getSendData(options));
      }
      catch (e) {
        exception = e;
      }
      let result = new dorado.util.AjaxResult(options);
      if (exception != null) {
        result._init(connObj);
        result._setException(exception);
      } else {
        result._init(connObj, true);
      }
      eventArg = {async:true, result:result};
      this.fireEvent("onDisconnect", this, eventArg);
      this.fireEvent("onResponse", this, eventArg);
      if (!alwaysReturn && exception != null) {
        throw exception;
      }
      return result;
    }
    finally {
      this._connectionPool.returnObject(connObj);
    }
  }});
dorado.util.AjaxEngine._parseXml = function(xml: any) {
  let xmlDoc = null;
  try {
    if (dorado.Browser.msie) {
      let activeX = ["MSXML2.DOMDocument", "MSXML.DOMDocument"];
      for (let i = 0; i < activeX.length; ++i) {
        try {
          xmlDoc = new ActiveXObject(activeX[i]);
          break;
        }
        catch (e) {
        }
      }
      xmlDoc.loadXML(xml);
    } else {
      let parser = new DOMParser();
      xmlDoc = parser.parseFromString(xml, "text/xml");
    }
  }
  finally {
    return xmlDoc;
  }
};
dorado.util.AjaxException = $extend(dorado.Exception, {$className:"dorado.util.AjaxException", constructor:function(message: any, description: any, connObj: any) {
    this.message = message || "Unknown Exception.";
    this.description = description;
    if (connObj != null) {
      this.url = connObj.url;
      this.method = connObj.method;
      this.status = connObj.conn.status;
      this.statusText = connObj.conn.statusText;
      if (this.status === 1223) {
        this.status = 204;
      }
    }
    $invokeSuper.call(this, arguments);
  }, toString:function() {
    let text = this.message;
    if (this.url) {
      text += "\nURL: " + this.url;
    }
    if (this.status) {
      text += "\nStatus: " + this.statusText + "(" + this.status + ")";
    }
    if (this.description) {
      text += "\n" + this.description;
    }
    return text;
  }});
dorado.util.AjaxTimeoutException = $extend(dorado.util.AjaxException, {$className:"dorado.util.AjaxTimeoutException"});
dorado.util.AjaxResult = $class({$className:"dorado.util.AjaxResult", constructor:function(options: any, connObj: any) {
    this.options = options;
    if (connObj != null) {
      this._init(connObj, true);
    }
  }, success:true, _init:function(connObj: any, parseResponse: any) {
    this._connObj = connObj;
    this.url = connObj.url;
    this.method = connObj.method;
    let conn = connObj.conn;
    this.status = conn.status;
    this.statusText = conn.statusText;
    this.allResponseHeaders = conn.getAllResponseHeaders();
    if (parseResponse) {
      this.text = conn.responseText;
      let exception, contentType = this.getResponseHeaders()["content-type"];
      if (contentType && contentType.indexOf("text/dorado-exception") >= 0) {
        exception = this._parseException(conn.responseText, connObj);
      } else {
        if (contentType && contentType.indexOf("text/runnable") >= 0) {
          exception = this._parseRunnableException(conn.responseText, connObj);
        } else {
          if (conn.status < 200 || conn.status >= 400) {
            if (dorado.windowClosed && conn.status === 0) {
              exception = new dorado.AbortException();
            } else {
              exception = new dorado.util.AjaxException("HTTP " + conn.status + " " + conn.statusText, null, connObj);
              if (conn.status === 0) {
                exception._processDelay = 1000;
              }
            }
          }
        }
      }
      if (exception) {
        this._setException(exception);
      }
    }
  }, _setException:function(exception: any) {
    this.success = false;
    this.exception = exception;
  }, _parseException:function(text: any) {
    let json = dorado.JSON.parse(text);
    if (json.exceptionType === "com.bstek.dorado.view.resolver.AbortException") {
      return new dorado.AbortException(json.message);
    } else {
      return new dorado.RemoteException(json.message, json.exceptionType, json.stackTrace);
    }
  }, _parseRunnableException:function(text: any) {
    return new dorado.RunnableException(text);
  }, getResponseHeaders:function() {
    let responseHeaders = this._responseHeaders;
    if (responseHeaders === undefined) {
      responseHeaders = {};
      this._responseHeaders = responseHeaders;
      try {
        let headerStr = this.allResponseHeaders;
        let headers = headerStr.split("\n");
        for (let i = 0; i < headers.length; i++) {
          let header = headers[i];
          let delimitPos = header.indexOf(":");
          if (delimitPos !== -1) {
            responseHeaders[header.substring(0, delimitPos).toLowerCase()] = header.substring(delimitPos + 2);
          }
        }
      }
      catch (e) {
      }
    }
    return responseHeaders;
  }, getXmlDocument:function() {
    let responseXML = this._responseXML;
    if (responseXML === undefined) {
      responseXML = dorado.util.AjaxEngine._parseXml(this.text);
      this._responseXML = responseXML;
    }
    return responseXML;
  }, getJsonData:function(untrusty: any) {
    let jsonData = this._jsonData;
    if (jsonData === undefined) {
      this._jsonData = jsonData = dorado.JSON.parse(this.text, untrusty);
    }
    return jsonData;
  }});
dorado.util.AjaxEngine.INSTANCES_PENDING_REQUESTS = [];
dorado.util.AjaxEngine.SHARED_INSTANCES = {};
dorado.util.AjaxEngine.ASYNC_REQUESTS = {};
dorado.util.AjaxEngine.getInstance = function(options: any) {
  let defaultOptions = $setting["ajax.defaultOptions"];
  if (defaultOptions) {
    defaultOptions = dorado.Object.apply({}, defaultOptions);
    options = dorado.Object.apply(defaultOptions, options);
  }
  let key = (options.url || "#EMPTY") + "|" + (options.batchable || false) + "|" + (options.method);
  let ajax = dorado.util.AjaxEngine.SHARED_INSTANCES[key];
  if (ajax === undefined) {
    ajax = new dorado.util.AjaxEngine({defaultOptions:options, autoBatchEnabled:options.autoBatchEnabled || options.batchable});
    dorado.util.AjaxEngine.SHARED_INSTANCES[key] = ajax;
  }
  return ajax;
};
dorado.util.AjaxEngine.processAllPendingRequests = function(force: any) {
  let engines = dorado.util.AjaxEngine.INSTANCES_PENDING_REQUESTS;
  if (!engines.length) {
    return;
  }
  for (let i = 0, len = engines.length; i < len; i++) {
    engines[i]._requestBatch(force);
  }
}, window.$ajax = new dorado.util.AjaxEngine();
dorado.util.Map = $class({$className:"dorado.util.Map", constructor:function(config: any) {
    this._map = {};
    if (config && config instanceof Object) {
      this.put(config);
    }
  }, put:function(k: any, v: any) {
    if (!k) {
      return;
    }
    if (v === undefined && k instanceof Object) {
      let obj = k;
      if (obj instanceof dorado.util.Map) {
        obj = obj._map;
      }
      if (obj) {
        let map = this._map;
        for (let p in obj) {
          if (obj.hasOwnProperty(p)) {
            map[p] = obj[p];
          }
        }
      }
    } else {
      this._map[k] = v;
    }
  }, set:function() {
    this.put.apply(this, arguments);
  }, get:function(k: any) {
    return this._map[k];
  }, isEmpty:function() {
    let map = this._map;
    for (let k in map) {
      if (map.hasOwnProperty(k)) {
        return false;
      }
    }
    return true;
  }, remove:function(k: any) {
    delete this._map[k];
  }, clear:function() {
    this._map = {};
  }, toJSON:function() {
    return this._map;
  }, keys:function() {
    let map = this._map, keys = [];
    for (let k in map) {
      if (map.hasOwnProperty(k)) {
        keys.push(k);
      }
    }
    return keys;
  }, eachKey:function(fn: any) {
    if (!fn) {
      return;
    }
    let map = this._map;
    for (let k in map) {
      if (map.hasOwnProperty(k)) {
        fn.call(this, k, map[k]);
      }
    }
  }, toString:function() {
    return "dorado.util.Map";
  }});
window.$map = function(obj: any) {
  return new dorado.util.Map(obj);
};
(function() {
  let maxZIndex = 9999;
  window.$DomUtils = dorado.util.Dom = {getInvisibleContainer:function() {
      let id = "_dorado_invisible_div";
      let div = document.getElementById(id);
      if (!div) {
        div = this.xCreate({tagName:"DIV", id:id, style:{position:"absolute", width:100, height:100, left:-200, top:-200, overflow:"hidden"}});
        document.body.appendChild(div);
      }
      return div;
    }, getUndisplayContainer:function() {
      let id = "_dorado_undisplay_div";
      let div = document.getElementById(id);
      if (!div) {
        div = this.xCreate({tagName:"DIV", id:id, style:{visibility:"hidden", display:"none"}});
        document.body.appendChild(div);
      }
      return div;
    }, getOwnerWindow:function(node: any) {
      return dorado.Browser.msie ? node.ownerDocument.parentWindow : node.ownerDocument.defaultView;
    }, isOwnerOf:function(node: any, owner: any) {
      while (true) {
        node = node.parentNode;
        if (node == null) {
          return false;
        }
        if (node === owner) {
          return true;
        }
      }
    }, findParent:function(node: any, fn: any, includeSelf: any) {
      if (includeSelf !== false) {
        if (fn(node)) {
          return node;
        }
      }
      while (true) {
        node = node.parentNode;
        if (!node) {
          break;
        }
        if (fn(node)) {
          return node;
        }
      }
      return null;
    }, xCreate:function(template: any, arg: any, context: any) {
      function setAttrs(el: any, attrs: any, jqEl: any) {
        let $el = jQuery(el);
        for (let attrName in attrs) {
          let attrValue = attrs[attrName];
          switch (attrName) {
            case "style":
              if (attrValue.constructor === String) {
                $el.attr("style", attrValue);
              } else {
                for (let styleName in attrValue) {
                  let v = attrValue[styleName];
                  if (styleName.match(/^width$|^height$|^top$|^left$|^right$|^bottom$/)) {
                    if (isFinite(v)) {
                      v += "px";
                    }
                  }
                  el.style[styleName] = v;
                }
              }
              break;
            case "outerWidth":
              jqEl.outerWidth(attrValue);
              break;
            case "outerHeight":
              jqEl.outerHeight(attrValue);
              break;
            case "tagName":
            case "content":
            case "contentText":
              continue;
            case "contextKey":
              if (context instanceof Object && attrValue && typeof attrValue === "string") {
                context[attrValue] = el;
              }
              continue;
            case "data":
              $el.data(attrValue);
              break;
            default:
              if (attrName.substring(0, 2) === "on") {
                let event = attrName.substring(2);
                if (typeof attrValue !== "function") {
                  // CSP 兼容：不支持字符串形式的事件处理器
                  console.warn("CSP-compliant mode: String event handlers are not supported. Please provide a function object.");
                  return el;
                }
                jqEl.bind(event, attrValue);
              } else {
                el[attrName] = attrValue;
              }
          }
        }
        return el;
      }
      function setText(el: any, content: any, jqEl: any, isText: any) {
        let isHtml = /(<\S[^><]*>)|(&.+;)/g;
        if (isText !== true && content.match(isHtml) != null && el.tagName.toUpperCase() !== "TEXTAREA") {
          el.innerHTML = content;
        } else {
          if (dorado.Browser.mozilla) {
            el.innerHTML = content.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\n/g, "<br />\n");
          } else {
            el.innerText = content;
          }
        }
        return el;
      }
      function appendChild(parentEl: any, el: any) {
        if (parentEl.nodeName.toUpperCase() === "TABLE" && el.nodeName.toUpperCase() === "TR") {
          let tbody;
          if (parentEl && parentEl.tBodies[0]) {
            tbody = parentEl.tBodies[0];
          } else {
            tbody = parentEl.appendChild(document.createElement("tbody"));
          }
          parentEl = tbody;
        }
        parentEl.appendChild(el);
      }
      if (typeof template === "function") {
        template = template(arg || window);
      }
      if (template instanceof Array) {
        let elements = [];
        for (let i = 0; i < template.length; i++) {
          elements.push(this.xCreate(template[i], arg, context));
        }
        return elements;
      }
      let tagName = template.tagName || "DIV";
      tagName = tagName.toUpperCase();
      let content = template.content;
      let el;
      if (dorado.Core.msie && tagName === "INPUT" && template.type) {
        el = document.createElement("<" + tagName + " type=\"" + template.type + "\"/>");
      } else {
        el = document.createElement(tagName);
      }
      let jqEl = jQuery(el);
      el = setAttrs(el, template, jqEl);
      if (content != null) {
        if (content.constructor === String) {
          if (content.charAt(0) === "^") {
            appendChild(el, document.createElement(content.substring(1)));
          } else {
            el = setText(el, content, jqEl);
          }
        } else {
          if (content instanceof Array) {
            for (let i = 0; i < content.length; i++) {
              let c = content[i];
              if (c.constructor === String) {
                if (c.charAt(0) === "^") {
                  appendChild(el, document.createElement(c.substring(1)));
                } else {
                  appendChild(el, document.createTextNode(c));
                }
              } else {
                appendChild(el, this.xCreate(c, arg, context));
              }
            }
          } else {
            if (content.nodeType) {
              appendChild(el, content);
            } else {
              appendChild(el, this.xCreate(content, arg, context));
            }
          }
        }
      } else {
        let contentText = template.contentText;
        if (contentText != null && contentText.constructor === String) {
          el = setText(el, contentText, jqEl, true);
        }
      }
      return el;
    }, BLANK_IMG:dorado.Setting["common.contextPath"] + "dorado/client/resources/blank.gif", setImgSrc:function(img: any, src: any) {
      src = $url(src) || BLANK_IMG;
      if (img.src !== src) {
        img.src = src;
      }
    }, setBackgroundImage:function(el: any, url: any) {
      if (url) {
        let reg = /url\(.*\)/i, m = url.match(reg);
        if (m) {
          m = m[0];
          let realUrl = jQuery.trim(m.substring(4, m.length - 1));
          realUrl = $url(realUrl);
          el.style.background = url.replace(reg, "url(" + realUrl + ")");
          return;
        }
        url = $url(url);
        url = "url(" + url + ")";
      } else {
        url = "";
      }
      if (el.style.backgroundImage !== url) {
        el.style.backgroundImage = url;
        el.style.backgroundPosition = "center";
      }
    }, placeCenterElement:function(element: any, container: any) {
      let offset = $fly(container).offset();
      element.style.left = (offset.left + (container.offsetWidth - element.offsetWidth) / 2) + "px";
      element.style.top = (offset.top + (container.offsetHeight - element.offsetHeight) / 2) + "px";
    }, getOrCreateChild:function(parentNode: any, index: any, tagName: any, fn: any) {
      let child, refChild;
      if (index < parentNode.childNodes.length) {
        child = refChild = parentNode.childNodes[index];
        if (fn && fn(child) === false) {
          child = null;
        }
      }
      if (!child) {
        child = (typeof tagName === "function") ? tagName(index) : ((tagName.constructor === String) ? document.createElement(tagName) : this.xCreate(tagName));
        (refChild) ? parentNode.insertBefore(child, refChild) : parentNode.appendChild(child);
      }
      return child;
    }, removeChildrenFrom:function(parentNode: any, from: any, fn: any) {
      let toRemove = [];
      for (let i = parentNode.childNodes.length - 1; i >= from; i--) {
        let child = parentNode.childNodes[i];
        if (fn && fn(child) === false) {
          continue;
        }
        toRemove.push(child);
      }
      if (toRemove.length > 0) {
        $fly(toRemove).remove();
      }
    }, isDragging:function() {
      let currentDraggable = jQuery.ui.ddmanager.current;
      return (currentDraggable && currentDraggable._mouseStarted);
    }, getCellPosition:function(event: any) {
      let element = event.srcElement || event.target, row = -1, column = -1;
      while (element && element !== element.ownerDocument.body) {
        let tagName = element.tagName.toLowerCase();
        if (tagName === "td") {
          row = element.parentNode.rowIndex;
          column = element.cellIndex;
          break;
        }
        element = element.parentNode;
      }
      if (element !== element.ownerDocument.body) {
        return {"row":row, "column":column, "element":element};
      }
      return null;
    }, dockAround:function(element: any, fixedElement: any, options: any) {
      options = options || {};
      let align = options.align || "innerleft", vAlign = options.vAlign || "innertop", offsetLeft = options.offsetLeft || 0, offsetTop = options.offsetTop || 0, autoAdjustPosition = options.autoAdjustPosition, handleOverflow = options.handleOverflow, maxWidth, maxHeight, adjustLeft, adjustTop, offsetParentBottom, offsetParentRight, overflowTrigger = false;
      let offsetParentWidth = 0, offsetParentHeight = 0, offsetParentOffset;
      if (element.offsetParent) {
        let offsetParentEl = $fly(element.offsetParent);
        offsetParentWidth = offsetParentEl.width();
        offsetParentHeight = offsetParentEl.height();
        offsetParentOffset = offsetParentEl.offset() || {left:0, top:0};
      }
      offsetParentRight = Math.floor(offsetParentWidth + offsetParentOffset.left);
      offsetParentBottom = Math.floor(offsetParentHeight + offsetParentOffset.top);
      if (fixedElement === window || !fixedElement) {
        fixedElement = document.body;
      }
      let position = jQuery(fixedElement).offset(), left = Math.floor(position.left), top = Math.floor(position.top), rect, newAlign, vAlignPrefix, overflowRect;
      if (fixedElement) {
        rect = getRect(fixedElement);
        if (options.gapX) {
          rect.left -= options.gapX;
          rect.right += options.gapX;
        }
        if (options.gapY) {
          rect.top -= options.gapY;
          rect.bottom += options.gapY;
        }
        if (align) {
          left = getLeft(rect, element, align);
          if ((left + element.offsetWidth > offsetParentRight) || (left < 0)) {
            if (!(autoAdjustPosition === false)) {
              if (align !== "center") {
                if (align.indexOf("left") !== -1) {
                  newAlign = align.replace("left", "right");
                } else {
                  if (align.indexOf("right") !== -1) {
                    newAlign = align.replace("right", "left");
                  }
                }
                adjustLeft = getLeft(rect, element, newAlign);
                if ((adjustLeft + element.offsetWidth > offsetParentRight) || (adjustLeft < 0)) {
                  left = 0;
                  overflowTrigger = true;
                  maxWidth = offsetParentWidth;
                } else {
                  left = adjustLeft;
                  align = newAlign;
                }
              } else {
                if (align === "center") {
                  if (left < 0) {
                    left = 0;
                    overflowTrigger = true;
                    maxWidth = offsetParentWidth;
                  }
                }
              }
            } else {
              overflowTrigger = true;
            }
          }
        }
        if (vAlign) {
          top = getTop(rect, element, vAlign);
          if ((top + element.offsetHeight > offsetParentBottom) || (top < 0)) {
            if (!(autoAdjustPosition === false)) {
              if (vAlign !== "center") {
                if (vAlign.indexOf("top") !== -1) {
                  vAlign = vAlign.replace("top", "bottom");
                  vAlignPrefix = vAlign.replace("top", "");
                } else {
                  if (vAlign.indexOf("bottom") !== -1) {
                    vAlign = vAlign.replace("bottom", "top");
                    vAlignPrefix = vAlign.replace("bottom", "");
                  }
                }
                adjustTop = getTop(rect, element, vAlign);
                if (adjustTop + element.offsetHeight > offsetParentBottom) {
                  overflowTrigger = true;
                  if (adjustTop < (offsetParentHeight / 2)) {
                    top = adjustTop;
                    maxHeight = offsetParentHeight - top;
                    vAlign = vAlignPrefix + "bottom";
                  } else {
                    maxHeight = element.offsetHeight + top;
                    vAlign = vAlignPrefix + "top";
                  }
                } else {
                  if (adjustTop < 0) {
                    overflowTrigger = true;
                    if (top > (offsetParentHeight / 2)) {
                      top = 0;
                      maxHeight = element.offsetHeight + adjustTop;
                      vAlign = vAlignPrefix + "top";
                    } else {
                      maxHeight = offsetParentHeight - top;
                      vAlign = vAlignPrefix + "bottom";
                    }
                  } else {
                    top = adjustTop;
                  }
                }
              } else {
                if (vAlign === "center") {
                  if (top < 0) {
                    overflowTrigger = true;
                    top = 0;
                    maxHeight = offsetParentHeight;
                  }
                }
              }
            } else {
              overflowTrigger = true;
            }
          }
        }
      }
      options.align = align;
      options.vAlign = vAlign;
      let finalLeft = left + offsetLeft, finalTop = top + offsetTop;
      $fly(element).offset({left:finalLeft, top:finalTop});
      finalLeft = parseInt($fly(element).css("left"), 10);
      finalTop = parseInt($fly(element).css("top"), 10);
      if (!(handleOverflow === false) && overflowTrigger) {
        if (typeof options.overflowHandler === "function") {
          overflowRect = {left:finalLeft, top:finalTop, align:align, vAlign:vAlign, maxHeight:maxHeight, maxWidth:maxWidth};
          options.overflowHandler.call(null, overflowRect);
        }
      }
      return {left:finalLeft, top:finalTop} ; //, 0:finalLeft, 1:finalTop};
    }, locateIn:function(element: any, options: any) {
      options = options || {};
      let offsetLeft = options.offsetLeft || 0, offsetTop = options.offsetTop || 0, handleOverflow = options.handleOverflow, parent = options.parent, adjustLeft, adjustTop, overflowTrigger = false, maxWidth, maxHeight, position = options.position, left = position ? position.left : 0, top = position ? position.top : 0, autoAdjustPosition = options.autoAdjustPosition;
      let offsetParentWidth = 0, offsetParentHeight = 0;
      if (element.offsetParent) {
        let offsetParentEl = $fly(element.offsetParent);
        offsetParentWidth = offsetParentEl.width();
        offsetParentHeight = offsetParentEl.height();
      }
      if (parent) {
        let parentPos = $fly(parent).offset();
        left += parentPos.left;
        top += parentPos.top;
      }
      if (!(autoAdjustPosition === false)) {
        if (top < 0) {
          top = 0;
        }
        if (left < 0) {
          left = 0;
        }
        if (left + element.offsetWidth > offsetParentWidth) {
          if (!(handleOverflow === false)) {
            adjustLeft = left - element.offsetWidth;
            if (adjustLeft > 0) {
              left = adjustLeft;
            } else {
              left = 0;
              overflowTrigger = true;
              maxWidth = offsetParentWidth;
            }
          } else {
            overflowTrigger = true;
          }
        }
        if (top + element.offsetHeight >= offsetParentHeight) {
          if (!(handleOverflow === false)) {
            adjustTop = top - element.offsetHeight;
            if (adjustTop < 0) {
              top = 0;
              overflowTrigger = true;
              maxHeight = offsetParentHeight;
            } else {
              top = adjustTop;
            }
          } else {
            overflowTrigger = true;
          }
        }
      }
      let finalLeft = left + offsetLeft, finalTop = top + offsetTop;
      $fly(element).left(finalLeft).top(finalTop);
      if (handleOverflow !== false && overflowTrigger) {
        if (typeof options.overflowHandler === "function") {
          let overflowRect = {left:finalLeft, top:finalTop, maxHeight:maxHeight, maxWidth:maxWidth};
          options.overflowHandler.call(null, overflowRect);
        }
      }
      return {left:finalLeft, top:finalTop}; //, 0:finalLeft, 1:finalTop};
    }, disableUserSelection:function(element: any) {
      if (dorado.Browser.msie) {
        $fly(element).bind("selectstart.disableUserSelection", onSelectStart);
      } else {
        element.style.MozUserSelect = "none";
        element.style.KhtmlUserSelect = "none";
        element.style.webkitUserSelect = "none";
        element.style.OUserSelect = "none";
        element.unselectable = "on";
      }
    }, enableUserSelection:function(element: any) {
      if (dorado.Browser.msie) {
        $fly(element).unbind("selectstart.disableUserSelection");
      } else {
        element.style.MozUserSelect = "";
        element.style.KhtmlUserSelect = "";
        element.style.webkitUserSelect = "";
        element.style.OUserSelect = "";
        element.unselectable = "";
      }
    }, bringToFront:function(dom: any, radius: any) {
      if (dorado.Browser.msie) {
        maxZIndex += 2;
      } else {
        maxZIndex += 1;
      }
      let zIndex = maxZIndex + (radius || 0);
      if (dom) {
        dom.style.zIndex = zIndex;
      }
      return zIndex;
    }};
  function onSelectStart() {
    return false;
  }
  function getRect(element: any) {
    if (element) {
      let width, height;
      if (element === window) {
        let $win = $fly(window), left = $win.scrollLeft(), top = $win.scrollTop();
        width = $win.width();
        height = $win.height();
        return {left:Math.floor(left), top:Math.floor(top), right:Math.floor(left) + width, bottom:Math.floor(top) + height};
      }
      let offset = $fly(element).offset();
      if (element === document.body) {
        width = $fly(window).width();
        height = $fly(window).height();
      } else {
        width = $fly(element).outerWidth();
        height = $fly(element).outerHeight();
      }
      return {left:Math.floor(offset.left), top:Math.floor(offset.top), right:Math.floor(offset.left + width), bottom:Math.floor(offset.top + height)};
    }
    return null;
  }
  function getLeft(rect: any, dom: any, align: any) {
    switch (align.toLowerCase()) {
      case "left":
        return rect.left - dom.offsetWidth;
      case "innerleft":
        return rect.left;
      case "center":
        return (rect.left + rect.right - dom.offsetWidth) / 2;
      case "innerright":
        return rect.right - dom.offsetWidth;
      case "right":
      default:
        return rect.right;
    }
  }
  function getTop(rect: any, dom: any, vAlign: any) {
    switch (vAlign.toLowerCase()) {
      case "top":
        return rect.top - dom.offsetHeight;
      case "innertop":
        return rect.top;
      case "center":
        return (rect.top + rect.bottom - dom.offsetHeight) / 2;
      case "innerbottom":
        return rect.bottom - dom.offsetHeight;
      case "bottom":
      default:
        return rect.bottom;
    }
  }
  function findValidContent(container: any) {
    let childNodes = container.childNodes;
    for (let i = 0, j = childNodes.length; i < j; i++) {
      let child = childNodes[i];
      let style = child.style;
      if (style.display !== "none" && (style.position === "" || style.position === "static")) {
        return child;
      }
    }
    return null;
  }
})();
jQuery.fn.shadow = function(options: any) {
  if (dorado.Browser.msie && dorado.Browser.version < 9) {
    return this;
  }
  options = options || {};
  let mode = options.mode || "drop";
  switch (mode.toLowerCase()) {
    case "drop":
      this.addClass("d-shadow-drop");
      break;
    case "sides":
      this.addClass("d-shadow-sides");
      break;
    case "frame":
      this.addClass("d-shadow-frame");
      break;
  }
  return this;
};
jQuery.fn.unshadow = function(options: any) {
  if (dorado.Browser.msie && dorado.Browser.version < 9) {
    return this;
  }
  options = options || {};
  let mode = options.mode || "drop";
  switch (mode.toLowerCase()) {
    case "drop":
      this.removeClass("d-shadow-drop");
      break;
    case "sides":
      this.removeClass("d-shadow-sides");
      break;
    case "frame":
      this.removeClass("d-shadow-frame");
      break;
  }
  return this;
};
(function($: any) {
  function num(el: any, prop: any) {
    return parseInt(jQuery.css(el.jquery ? el[0] : el, prop, true)) || 0;
  }
  $.fn.bringToFront = function(radius: any) {
    return this.css("zIndex", $DomUtils.bringToFront(null, radius));
  };
  $.each(["left", "top", "right", "bottom"], function(i: any, name: any) {
    $.fn[name] = function(val: any) {
      return this.css(name, val);
    };
  });
  let oldPosition = $.fn.position;
  $.fn.position = function(left: any, top: any) {
    if (arguments.length) {
      this.css("left", left).css("top", top);
      return this;
    } else {
      return oldPosition.call(this);
    }
  };
  $.each(["Height", "Width"], function(i: any, name: any) {
    let tl = i ? "Left" : "Top";
    let br = i ? "Right" : "Bottom";
    let fn = $.fn["outer" + name];
    $.fn["outer" + name] = function(arg: any) {
      if (arg != null && (arg.constructor !== Boolean || arguments.length > 1)) {
        if (arg.constructor === String) {
          if (arg === "auto" || arg.match("%")) {
            return this[name.toLowerCase()](arg);
          } else {
            if (arg === "none") {
              return this.css(name.toLowerCase(), "");
            }
          }
        } else {
          let n = parseInt(arg);
          if (arguments[1] === true) {
            n = n - num(this, "padding" + tl) - num(this, "padding" + br) - num(this, "border" + tl + "Width") - num(this, "border" + br + "Width") - num(this, "margin" + tl) - num(this, "margin" + br);
          } else {
            n = n - num(this, "padding" + tl) - num(this, "padding" + br) - num(this, "border" + tl + "Width") - num(this, "border" + br + "Width");
          }
          return this[name.toLowerCase()](n);
        }
        return this;
      }
      return fn.apply(this, arguments);
    };
  });
  $.each(["Left", "Top", "Right", "Bottom"], function(i: any, name: any) {
    $.fn["edge" + name] = function(includeMargin: any) {
      let n = num(this, "padding" + name) + num(this, "border" + name + "Width");
      if (includeMargin) {
        n += num(this, "margin" + name);
      }
      return n;
    };
  });
  $.fn.edgeWidth = function(includeMargin: any) {
    return this.edgeLeft(includeMargin) + this.edgeRight(includeMargin);
  };
  $.fn.edgeHeight = function(includeMargin: any) {
    return this.edgeTop(includeMargin) + this.edgeBottom(includeMargin);
  };
  $.fn.addClassOnHover = function(cls: any, clsOwner: any, fn: any) {
    clsOwner = clsOwner || this;
    this.hover(function() {
      if ($DomUtils.isDragging()) {
        return;
      }
      if (typeof fn === "function" && !fn.call(this)) {
        return;
      }
      clsOwner.addClass(cls);
    }, function() {
      clsOwner.removeClass(cls);
    });
    return this;
  };
  $.fn.addClassOnFocus = function(cls: any, clsOwner: any, fn: any) {
    clsOwner = clsOwner || this;
    this.focus(function() {
      if (typeof fn === "function" && !fn.call(this)) {
        return;
      }
      clsOwner.addClass(cls);
    });
    this.blur(function() {
      clsOwner.removeClass(cls);
    });
    return this;
  };
  $.fn.addClassOnClick = function(cls: any, clsOwner: any, fn: any) {
    clsOwner = clsOwner || this;
    this.mousedown(function() {
      if (typeof fn === "function" && !fn.call(this)) {
        return;
      }
      clsOwner.addClass(cls);
      $(document).one("mouseup", function() {
        clsOwner.removeClass(cls);
      });
    });
    return this;
  };
  $.fn.repeatOnClick = function(fn: any, interval: any) {
    this.mousedown(function() {
      let timer;
      if (typeof fn === "function") {
        fn.apply(null, []);
        timer = setInterval(fn, interval || 100);
      }
      $(document).one("mouseup", function() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      });
    });
    return this;
  };
  let disableMouseWheel = function(event: any) {
    event.preventDefault();
  };
  $.fn.fullWindow = function(options: any) {
    let self = this;
    if (self.length === 1) {
      let dom = self[0], containBlock = dom.parentNode, parentsOverflow = [], parentsPositioned = false, parentsPosition = [];
      function doFilter() {
        if (this === document.body || (/(auto|scroll|hidden)/).test(jQuery.css(this, "overflow") + jQuery.css(this, "overflow-y"))) {
          parentsOverflow.push({parent:this, overflow:jQuery.css(this, "overflow"), overflowY:jQuery.css(this, "overflow-y"), scrollTop:this.scrollTop});
          let overflowValue = this === document.body ? "hidden" : "visible";
          let $this = jQuery(this);
          $this.prop("scrollTop", 0).css({overflow:overflowValue, overflowY:overflowValue});
          if ($this.mousewheel) {
            $this.mousewheel(disableMouseWheel);
          }
        }
        if (!parentsPositioned && dorado.Browser.msie && dorado.Browser.version <= 7) {
          if (this === document.body || (/(relative|absolute)/).test(jQuery.css(this, "position"))) {
            if (jQuery.css(this, "z-index") === "") {
              parentsPosition.push(this);
              parentsPositioned = true;
              jQuery(this).css("z-index", 100);
            }
          }
        }
      }
      while (containBlock !== document.body) {
        if (jQuery(containBlock).css("position") !== "static") {
          break;
        }
        containBlock = containBlock.parentNode;
      }
      options = options || {};
      let docWidth = jQuery(window).width(), docHeight = jQuery(window).height();
      let isAbs = (self.css("position") === "absolute");
      let backupStyle = {position:dom.style.position, left:dom.style.left, top:dom.style.top};
      let poffset = jQuery(containBlock).offset() || {left:0, top:0}, position, left, top;
      self.css({position:"absolute", left:0, top:0});
      position = {left:self.prop("offsetLeft"), top:self.prop("offsetTop")};
      left = -1 * (poffset.left + position.left);
      top = -1 * (poffset.top + position.top);
      self.parents().filter(doFilter);
      let targetStyle = {position:"absolute", left:left, top:top};
      if (options.modifySize !== false) {
        backupStyle.width = dom.style.width;
        backupStyle.height = dom.style.height;
        targetStyle.width = docWidth;
        targetStyle.height = docHeight;
      }
      jQuery.data(dom, "fullWindow.backupStyle", backupStyle);
      jQuery.data(dom, "fullWindow.parentsOverflow", parentsOverflow);
      jQuery.data(dom, "fullWindow.parentsPosition", parentsPosition);
      jQuery.data(dom, "fullWindow.backupSize", {width:self.outerWidth(), height:self.outerHeight()});
      self.css(targetStyle).bringToFront();
      if (dorado.Browser.msie && dorado.Browser.msie <= 7) {
        jQuery(".d-dialog .button-panel").css("visibility", "hidden");
        jQuery(".d-dialog .dialog-footer").css("visibility", "hidden");
      }
      let callback = options.callback;
      if (callback) {
        callback({width:docWidth, height:docHeight});
      }
    }
    return this;
  };
  $.fn.unfullWindow = function(options: any) {
    let self = this;
    if (self.length === 1) {
      options = options || {};
      let dom = self[0], callback = options.callback;
      let backupStyle = jQuery.data(dom, "fullWindow.backupStyle"), backupSize = jQuery.data(dom, "fullWindow.backupSize"), parentsOverflow = jQuery.data(dom, "fullWindow.parentsOverflow"), parentsPosition = jQuery.data(dom, "fullWindow.parentsPosition");
      if (backupStyle) {
        self.css(backupStyle);
      }
      if (callback) {
        callback(backupSize);
      }
      if (parentsOverflow) {
        for (let i = 0, j = parentsOverflow.length; i < j; i++) {
          let parentOverflow = parentsOverflow[i];
          let $parent = jQuery(parentOverflow.parent);
          $parent.css({overflow:parentOverflow.overflow, overflowY:parentOverflow.overflowY}).prop("scrollTop", parentOverflow.scrollTop);
          if ($parent.unmousewhee) {
            $parent.unmousewheel(disableMouseWheel);
          }
        }
      }
      if (parentsPosition) {
        for (let i = 0, j = parentsPosition.length; i < j; i++) {
          let parentPosition = parentsPosition[i];
          jQuery(parentPosition).css("z-index", "");
        }
      }
      if (dorado.Browser.msie && dorado.Browser.msie <= 7) {
        jQuery(".d-dialog .button-panel").css("visibility", "");
        jQuery(".d-dialog .dialog-footer").css("visibility", "");
      }
      jQuery.data(dom, "fullWindow.backupStyle", null);
      jQuery.data(dom, "fullWindow.backupSize", null);
      jQuery.data(dom, "fullWindow.parentsOverflow", null);
    }
    return this;
  };
  let hashTimerInited = false, storedHash;
  $.fn.hashchange = function(fn: any) {
    this.bind("hashchange", fn);
    if (!hashTimerInited && jQuery.browser.msie && jQuery.browser.version < 8) {
      hashTimerInited = true;
      let storedHash = window.location.hash;
      window.setInterval(function() {
        if (window.location.hash !== storedHash) {
          storedHash = window.location.hash;
          $(window).trigger("hashchange");
        }
      }, 100);
    }
  };
})(jQuery);
jQuery.fn.xCreate = function(template: any, arg: any, options: any) {
  let parentEl = this[0];
  let element = $DomUtils.xCreate(template, arg, (options ? options.context : null));
  if (element) {
    let insertBef = false, returnNewElements = false, refNode = null;
    if (options instanceof Object) {
      insertBef = options.insertBefore;
      refNode = (options.refNode) ? options.refNode : parentEl.firstChild;
      returnNewElements = options.returnNewElements;
    }
    let elements = (element instanceof Array) ? element : [element];
    for (let i = 0; i < elements.length; i++) {
      if (insertBef && refNode) {
        parentEl.insertBefore(elements[i], refNode);
      } else {
        parentEl.appendChild(elements[i]);
      }
    }
  }
  return returnNewElements ? jQuery(elements) : this;
};
(function() {
  if (jQuery.Tween) {
    let oldFn = jQuery.Tween.prototype.run;
    jQuery.Tween.prototype.run = function(percent: any) {
      this.state = percent;
      return oldFn.apply(this, arguments);
    };
  }
  jQuery.fn.region = function() {
    let self = this, element = self[0];
    if (self.length === 1) {
      let position = self.offset(), width = element.offsetWidth, height = element.offsetHeight;
      return {top:position.top, right:position.left + width, left:position.left, bottom:position.top + height, height:height, width:width};
    }
  };
  jQuery.fn.innerRegion = function() {
    let el = this, element = el[0];
    if (el.length === 1) {
      let position = el.offset(), width = el.width(), height = el.height(), borderTop = parseInt(el.css("border-left-width"), 10) || 0, borderLeft = parseInt(el.css("border-top-width"), 10) || 0, paddingLeft = parseInt(el.css("padding-left"), 10) || 0, paddingTop = parseInt(el.css("padding-top"), 10) || 0;
      return {top:position.top + borderLeft + paddingTop, right:position.left + borderTop + paddingLeft + width, left:position.left + borderTop + paddingLeft, bottom:position.top + borderLeft + paddingTop + height, height:height, width:width};
    }
  };
  let propertyMap = {normal:["position", "visibility", "left", "right", "top", "bottom", "width", "height", "zIndex"], safe:["overflow", "position", "width", "height"], child:["position", "left", "right", "top", "bottom", "width", "height"]}, DOCKABLE_STYLE_RESTORE = "dockStyleRestore", DOCK_DATA = "dockData";
  let backupStyle = function(element: any, type: any) {
    let props = propertyMap[type || "normal"], object = {};
    if (props) {
      for (let i = 0, j = props.length; i < j; i++) {
        let prop = props[i];
        object[prop] = element.style[prop];
      }
    }
    jQuery.data(element, DOCKABLE_STYLE_RESTORE, object);
  };
  let ratioMap = {top:1, bottom:-1, left:1, right:-1}, dockStyleMap = {top:{horizontal:"left", vertical:"top", style:{left:0, top:0, right:"auto", bottom:"auto"}}, bottom:{horizontal:"left", vertical:"bottom", style:{left:0, top:"auto", right:"auto", bottom:0}}, left:{horizontal:"left", vertical:"top", style:{left:0, top:0, right:"auto", bottom:"auto"}}, right:{horizontal:"right", vertical:"top", style:{left:"auto", top:0, right:0, bottom:"auto"}}};
  jQuery.fn.dockable = function(direction: any, safe: any, showMask: any) {
    let self = this;
    if (self.length === 1) {
      direction = direction || "bottom";
      let element = self[0], absolute = (self.css("position") === "absolute"), leftStart = absolute ? parseInt(self.css("left"), 10) || 0 : 0, topStart = absolute ? parseInt(self.css("top"), 10) || 0 : 0;
      backupStyle(element, safe ? "safe" : "normal");
      self.css({visibility:"hidden", display:"block"});
      let dockConfig = dockStyleMap[direction], hori = dockConfig.horizontal, vert = dockConfig.vertical, rect = {width:self.outerWidth(), height:self.outerHeight()}, wrap, mask;
      if (safe) {
        let horiRatio = ratioMap[hori], vertRatio = ratioMap[vert], parentRegion = self.innerRegion(), child = element.firstChild, region, childStyle = {}, childEl;
        while (child) {
          childEl = jQuery(child);
          backupStyle(child, "child");
          region = childEl.region();
          childStyle[hori] = horiRatio * (region[hori] - parentRegion[hori]);
          childStyle[vert] = vertRatio * (region[vert] - parentRegion[vert]);
          childEl.css(childStyle).outerWidth(child.offsetWidth).outerHeight(child.offsetHeight);
          child = child.nextSibling;
        }
        if (absolute) {
          self.outerWidth(rect.width).outerHeight(rect.height).css({overflow:"hidden", visibility:""}).find("> *").css("position", "absolute");
        } else {
          self.css({overflow:"hidden", position:"relative", visibility:""}).find("> *").css("position", "absolute");
        }
      } else {
        wrap = document.createElement("div");
        let wrapEl = jQuery(wrap);
        if (absolute) {
          wrap.style.position = "absolute";
          wrap.style.left = self.css("left");
          wrap.style.top = self.css("top");
          wrapEl.bringToFront();
        } else {
          wrap.style.position = "relative";
          element.style.position = "absolute";
        }
        wrap.style.overflow = "hidden";
        wrapEl.insertBefore(element);
        wrap.appendChild(element);
        let style = dockConfig.style;
        style.visibility = "";
        self.css(style).outerWidth(rect.width).outerHeight(rect.height);
      }
      if (showMask !== false) {
        mask = document.createElement("div");
        let maskEl = jQuery(mask);
        maskEl.css({position:"absolute", left:0, top:0, background:"white", opacity:0}).bringToFront().outerWidth(rect.width).outerHeight(rect.height);
        if (safe) {
          element.appendChild(mask);
        } else {
          wrap.appendChild(mask);
        }
      }
      jQuery.data(element, DOCK_DATA, {rect:rect, mask:mask, wrap:wrap, leftStart:leftStart, topStart:topStart});
    }
    return this;
  };
  jQuery.fn.undockable = function(safe: any) {
    let self = this;
    if (self.length === 1) {
      let element = self[0], dockData = jQuery.data(element, DOCK_DATA);
      if (dockData == null) {
        return;
      }
      if (safe) {
        self.css(jQuery.data(element, DOCKABLE_STYLE_RESTORE)).find("> *").each(function(index: any, child: any) {
          let style = jQuery.data(child, DOCKABLE_STYLE_RESTORE);
          if (style != null) {
            jQuery(child).css(style);
          }
          jQuery.data(child, DOCKABLE_STYLE_RESTORE, null);
        });
        jQuery(dockData.mask).remove();
      } else {
        let wrap = dockData.wrap;
        if (wrap) {
          self.css(jQuery.data(element, DOCKABLE_STYLE_RESTORE)).insertAfter(wrap);
          jQuery(wrap).remove();
        }
      }
      jQuery.data(element, DOCK_DATA, null);
      jQuery.data(element, DOCKABLE_STYLE_RESTORE, null);
    }
    return this;
  };
  let slideInDockDirMap = {l2r:"right", r2l:"left", t2b:"bottom", b2t:"top"}, slideOutDockDirMap = {l2r:"left", r2l:"right", t2b:"top", b2t:"bottom"}, slideSizeMap = {l2r:"height", r2l:"height", t2b:"width", b2t:"width"};
  let getAnimateConfig = function(type: any, direction: any, element: any, safe: any) {
    let dockData = jQuery.data(element, DOCK_DATA), rect = dockData.rect, leftStart = dockData.leftStart, topStart = dockData.topStart;
    if (safe) {
      if (type === "out") {
        switch (direction) {
          case "t2b":
            return {top:[topStart, topStart + rect.height], height:[rect.height, 0]};
          case "r2l":
            return {width:[rect.width, 0]};
          case "b2t":
            return {height:[rect.height, 0]};
          case "l2r":
            return {left:[leftStart, leftStart + rect.width], width:[rect.width, 0]};
        }
      } else {
        switch (direction) {
          case "t2b":
            return {height:[0, rect.height]};
          case "l2r":
            return {width:[0, rect.width]};
          case "b2t":
            return {top:[topStart + rect.height, topStart], height:[0, rect.height]};
          case "r2l":
            return {left:[leftStart + rect.width, leftStart], width:[0, rect.width]};
        }
      }
    } else {
      let property = slideSizeMap[direction];
      jQuery(dockData.wrap).css(property, dockData.rect[property]);
      if (type === "in") {
        switch (direction) {
          case "t2b":
            return {height:[0, rect.height]};
          case "l2r":
            return {width:[0, rect.width]};
          case "b2t":
            return {top:[topStart + rect.height, topStart], height:[0, rect.height]};
          case "r2l":
            return {left:[leftStart + rect.width, leftStart], width:[0, rect.width]};
        }
      } else {
        if (type === "out") {
          switch (direction) {
            case "t2b":
              return {top:[topStart, topStart + rect.height], height:[rect.height, 0]};
            case "r2l":
              return {width:[rect.width, 0]};
            case "b2t":
              return {height:[rect.height, 0]};
            case "l2r":
              return {left:[leftStart, leftStart + rect.width], width:[rect.width, 0]};
          }
        }
      }
    }
  };
  let slide = function(type: any, element: any, options: any, safe: any) {
    options = typeof options === "string" ? {direction:options} : options || {};
    let direction = options.direction || "t2b", callback = options.complete, step = options.step, start = options.start, animConfig, animElement = element, animEl, delayFunc, inited = false;
    delayFunc = function(direction: any) {
      if (start) {
        if (type === "in") {
          $fly(element).css("display", "");
        }
        start.call(element);
      }
      $fly(element).dockable(type === "in" ? slideInDockDirMap[direction] : slideOutDockDirMap[direction], safe);
      animConfig = getAnimateConfig(type, direction, element, safe);
      animEl = jQuery(safe ? animElement : jQuery.data(element, DOCK_DATA).wrap);
      for (let prop in animConfig) {
        let value = animConfig[prop];
        animEl.css(prop, value[0]);
      }
      inited = true;
    };
    options.step = function(now: any, animate: any) {
      if (!inited) {
        delayFunc(direction);
      }
      let defaultEasing = animate.options.easing || (jQuery.easing.swing ? "swing" : "linear"), pos = jQuery.easing[defaultEasing](animate.state, animate.options.duration * animate.state, 0, 1, animate.options.duration);
      let nowStyle = {};
      for (let prop in animConfig) {
        let range = animConfig[prop];
        nowStyle[prop] = Math.round(range[0] + (range[1] - range[0]) * pos);
      }
      animEl.css(nowStyle);
      if (step) {
        step.call(animate.elem, nowStyle, animate);
      }
    };
    options.complete = function() {
      $fly(element).undockable(safe);
      $fly(element).css("display", type === "out" ? "none" : "");
      if (typeof callback === "function") {
        callback.apply(null, []);
      }
    };
    options.duration = options.duration ? options.duration : 300;
    $fly(element).animate({dummy:1}, options);
  };
  jQuery.fn.slideIn = function(options: any) {
    let self = this;
    if (self.length === 1) {
      slide("in", self[0], options, false);
    }
    return this;
  };
  jQuery.fn.slideOut = function(options: any) {
    let self = this;
    if (self.length === 1) {
      slide("out", self[0], options, false);
    }
    return this;
  };
  jQuery.fn.safeSlideIn = function(options: any) {
    let self = this;
    if (self.length === 1) {
      slide("in", self[0], options, true);
    }
    return this;
  };
  jQuery.fn.safeSlideOut = function(options: any) {
    let self = this;
    if (self.length === 1) {
      slide("out", self[0], options, true);
    }
    return this;
  };
  let zoomCoverPool = new dorado.util.ObjectPool({makeObject:function() {
      let cover = document.createElement("div");
      cover.className = "i-animate-zoom-proxy d-animate-zoom-proxy";
      jQuery(document.body).append(cover);
      return cover;
    }});
  let zoom = function(type: any, element: any, options: any) {
    let position = options.position, animTarget = options.animateTarget, startLeft, startTop, endLeft, endTop, offset, isTypeIn = (type !== "out"), elWidth, elHeight;
    if (position) {
      let oldLeft = element.style.left, oldTop = element.style.top;
      position = $fly(element).css(position).offset();
      $fly(element).css({"left":oldLeft || "", "top":oldTop || ""});
    }
    if (typeof animTarget === "string") {
      animTarget = jQuery(animTarget)[0];
    } else {
      if (animTarget instanceof dorado.widget.Control) {
        animTarget = animTarget._dom;
      }
    }
    let elementEl = jQuery(element), animTargetEl = jQuery(animTarget);
    if (type === "in") {
      if (animTarget) {
        offset = animTargetEl.offset();
        startTop = offset.top;
        startLeft = offset.left;
        endTop = position.top;
        endLeft = position.left;
      } else {
        offset = elementEl.offset();
        elWidth = elementEl.outerWidth();
        elHeight = elementEl.outerHeight();
        startTop = offset.top + elHeight / 2;
        startLeft = offset.left + elWidth / 2;
        endTop = position.top;
        endLeft = position.left;
      }
    } else {
      if (animTarget) {
        offset = animTargetEl.offset();
        if (!position) {
          position = elementEl.offset();
        }
        startTop = position.top;
        startLeft = position.left;
        endTop = offset.top;
        endLeft = offset.left;
      } else {
        offset = elementEl.offset();
        elWidth = elementEl.outerWidth();
        elHeight = elementEl.outerHeight();
        startTop = offset.top;
        startLeft = offset.left;
        endTop = offset.top + elHeight / 2;
        endLeft = offset.left + elWidth / 2;
      }
    }
    let cover = zoomCoverPool.borrowObject();
    jQuery(cover).css({display:"", top:startTop, left:startLeft, width:isTypeIn ? 0 : elementEl.width(), height:isTypeIn ? 0 : elementEl.height()}).bringToFront().animate({top:endTop, left:endLeft, width:isTypeIn ? elementEl.width() : 0, height:isTypeIn ? elementEl.height() : 0}, {duration:options.animateDuration || 300, easing:options.animateEasing, complete:function() {
        cover.style.display = "none";
        zoomCoverPool.returnObject(cover);
        options.complete.apply(null, []);
      }});
  };
  jQuery.fn.zoomIn = function(options: any) {
    let self = this;
    if (self.length === 1) {
      zoom("in", self[0], options);
    }
    return this;
  };
  jQuery.fn.zoomOut = function(options: any) {
    let self = this;
    if (self.length === 1) {
      zoom("out", self[0], options);
    }
    return this;
  };
  let isFunction = function(value: any) {
    return ({}).toString.call(value) === "[object Function]";
  };
  let vendor = (/webkit/i).test(navigator.appVersion) ? "webkit" : (/firefox/i).test(navigator.userAgent) ? "moz" : (/trident/i).test(navigator.userAgent) ? "ms" : "opera" in window ? "o" : "", cssVendor = "-" + vendor + "-", TRANSITION = cssVendor + "transition", TRANSFORM = cssVendor + "transform", TRANSFORMORIGIN = cssVendor + "transform-origin", BACKFACEVISIBILITY = cssVendor + "backface-visibility";
  let transitionEnd = "transitionEnd";
  if (jQuery.browser.webkit) {
    transitionEnd = "webkitTransitionEnd";
  } else {
    if (jQuery.browser.msie) {
      transitionEnd = "msTransitionEnd";
    } else {
      if (jQuery.browser.mozilla) {
        transitionEnd = "transitionend";
      } else {
        if (jQuery.browser.opera) {
          transitionEnd = "oTransitionEnd";
        }
      }
    }
  }
  jQuery.fn.anim = function(properties: any, duration: any, ease: any, callback: any) {
    let transforms = [], opacity, key, callbackCalled = false;
    for (key in properties) {
      if (key === "opacity") {
        opacity = properties[key];
      } else {
        transforms.push(key + "(" + properties[key] + ")");
      }
    }
    let invokeCallback = function() {
      if (!callbackCalled) {
        callback();
        callbackCalled = true;
      }
    };
    if (parseFloat(duration) !== 0 && isFunction(callback)) {
      this.one(transitionEnd, invokeCallback);
      setTimeout(invokeCallback, duration * 1000 + 50);
    } else {
      setTimeout(callback, 0);
    }
    return this.css({opacity:opacity}).css(TRANSITION, "all " + (duration !== undefined ? duration : 0.5) + "s " + (ease || "")).css(TRANSFORM, transforms.join(" "));
  };
  let modernZoom = function(type: any, el: any, options: any) {
    if (!el) {
      return;
    }
    options = options || {};
    let position = options.position, animTarget = options.animateTarget, startLeft, startTop, endLeft, endTop, offset;
    if (typeof animTarget === "string") {
      animTarget = jQuery(animTarget)[0];
    } else {
      if (animTarget instanceof dorado.widget.Control) {
        animTarget = animTarget._dom;
      }
    }
    let elementEl = jQuery(el), animTargetEl = jQuery(animTarget);
    if (type === "in") {
      if (animTarget) {
        offset = animTargetEl.offset();
        startTop = offset.top;
        startLeft = offset.left;
        endTop = position.top;
        endLeft = position.left;
      }
    } else {
      if (animTarget) {
        offset = animTargetEl.offset();
        if (!position) {
          position = elementEl.offset();
        }
        startTop = position.top;
        startLeft = position.left;
        endTop = offset.top;
        endLeft = offset.left;
      }
    }
    let fromScale = 1, toScale = 1;
    if (type === "out") {
      toScale = 0.01;
    } else {
      fromScale = 0.01;
    }
    if (animTarget) {
      $(el).css({left:startLeft, top:startTop}).css(TRANSFORM, "scale(" + fromScale + ")").css(TRANSFORMORIGIN, "0 0");
    } else {
      $(el).css(TRANSFORM, "scale(" + fromScale + ")").css(TRANSFORMORIGIN, "50% 50%");
    }
    let callback = function() {
      if (options.complete) {
        options.complete.apply(null, []);
      }
      $(el).css(TRANSITION, "").css(TRANSFORMORIGIN, "").css(TRANSFORM, "");
    };
    if (animTarget) {
      setTimeout(function() {
        $(el).anim({}, options.animateDuration ? options.animateDuration / 1000 : 0.3, "ease-in-out", callback).css({left:endLeft, top:endTop}).css(TRANSFORM, "scale(" + toScale + ")").css(TRANSFORMORIGIN, "0 0");
      }, 5);
    } else {
      setTimeout(function() {
        $(el).anim({}, options.animateDuration ? options.animateDuration / 1000 : 0.3, "ease-in-out", callback).css(TRANSFORM, "scale(" + toScale + ")").css(TRANSFORMORIGIN, "50% 50%");
      }, 5);
    }
  };
  let flip = function(type: any, el: any, options: any) {
    if (!el) {
      return;
    }
    options = options || {};
    let callback = function() {
      if (options.complete) {
        options.complete.apply(null, []);
      }
      $(el).css(TRANSITION, "").css(TRANSFORMORIGIN, "").css(TRANSFORM, "").css(BACKFACEVISIBILITY, "");
    };
    let rotateProp = "Y", fromScale = 1, toScale = 1, fromRotate = 0, toRotate = 0;
    if (type === "out") {
      toRotate = -180;
      toScale = 0.8;
    } else {
      fromRotate = 180;
      fromScale = 0.8;
    }
    if (options.direction === "up" || options.direction === "down") {
      rotateProp = "X";
    }
    if (options.direction === "right" || options.direction === "left") {
      toRotate *= -1;
      fromRotate *= -1;
    }
    $(el).css(TRANSFORM, "rotate" + rotateProp + "(" + fromRotate + "deg) scale(" + fromScale + ")").css(BACKFACEVISIBILITY, "hidden");
    setTimeout(function() {
      $(el).anim({}, options.animateDuration ? options.animateDuration / 1000 : 0.3, "linear", callback).css(TRANSFORM, "rotate" + rotateProp + "(" + toRotate + "deg) scale(" + toScale + ")").css(BACKFACEVISIBILITY, "hidden");
    }, 5);
  };
  jQuery.fn.modernZoomIn = function(options: any) {
    let self = this;
    if (self.length === 1) {
      modernZoom("in", self[0], options);
    }
    return this;
  };
  jQuery.fn.modernZoomOut = function(options: any) {
    let self = this;
    if (self.length === 1) {
      modernZoom("out", self[0], options);
    }
    return this;
  };
  jQuery.fn.flipIn = function(options: any) {
    let self = this;
    if (self.length === 1) {
      options.direction = "left";
      flip("in", self[0], options);
    }
    return this;
  };
  jQuery.fn.flipOut = function(options: any) {
    let self = this;
    if (self.length === 1) {
      options.direction = "right";
      flip("out", self[0], options);
    }
    return this;
  };
  let getWin = function(elem: any) {
    return (elem && ("scrollTo" in elem) && elem["document"]) ? elem : elem && elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : elem === undefined ? window : false;
  }, SCROLL_TO = "scrollTo", DOCUMENT = "document";
  jQuery.fn.scrollIntoView = function(container: any, top: any, hscroll: any) {
    let self = this, elem;
    if (self.length === 1) {
      elem = self[0];
    }
    container = typeof container === "string" ? jQuery(container)[0] : container;
    hscroll = hscroll === undefined ? true : !!hscroll;
    top = top === undefined ? true : !!top;
    if (!container || container === window) {
      return elem.scrollIntoView(top);
    }
    if (container && container.nodeType === 9) {
      container = getWin(container);
    }
    let isWin = container && (SCROLL_TO in container) && container[DOCUMENT], elemOffset = self.offset(), containerOffset = isWin ? {left:jQuery(container).scrollLeft(), top:jQuery(container).scrollTop()} : jQuery(container).offset(), diff = {left:elemOffset["left"] - containerOffset["left"], top:elemOffset["top"] - containerOffset["top"]}, ch = isWin ? jQuery(window).height() : container.clientHeight, cw = isWin ? jQuery(window).width() : container.clientWidth, cl = jQuery(container).scrollLeft(), ct = jQuery(container).scrollTop(), cr = cl + cw, cb = ct + ch, eh = elem.offsetHeight, ew = elem.offsetWidth, l = diff.left + cl - (parseInt(jQuery(container).css("borderLeftWidth")) || 0), t = diff.top + ct - (parseInt(jQuery(container).css("borderTopWidth")) || 0), r = l + ew, b = t + eh, t2, l2;
    if (eh > ch || t < ct || top) {
      t2 = t;
    } else {
      if (b > cb) {
        t2 = b - ch;
      }
    }
    if (hscroll) {
      if (ew > cw || l < cl || top) {
        l2 = l;
      } else {
        if (r > cr) {
          l2 = r - cw;
        }
      }
    }
    if (isWin) {
      if (t2 !== undefined || l2 !== undefined) {
        container[SCROLL_TO](l2, t2);
      }
    } else {
      if (t2 !== undefined) {
        container["scrollTop"] = t2;
      }
      if (l2 !== undefined) {
        container["scrollLeft"] = l2;
      }
    }
  };
})();
(function($: any) {
  let oldDraggable = $.fn.draggable;
  $.fn.draggable = function(options: any) {
    let draggingInfo, doradoDraggable;
    if (options) {
      draggingInfo = options.draggingInfo;
      doradoDraggable = options.doradoDraggable;
    }
    if (draggingInfo || doradoDraggable) {
      let originOptions = options;
      options = dorado.Object.apply({}, originOptions);
      options.createDraggingInfo = function(evt: any) {
        let draggingInfo = originOptions.draggingInfo;
        if (typeof draggingInfo === "function") {
          draggingInfo = draggingInfo.call(this, this, options);
        }
        if (!draggingInfo) {
          if (doradoDraggable) {
            draggingInfo = doradoDraggable.createDraggingInfo(this, options);
          }
          if (!draggingInfo) {
            draggingInfo = new dorado.DraggingInfo();
          }
        }
        if (draggingInfo) {
          draggingInfo.set("element", this);
        }
        return draggingInfo;
      };
      if (typeof originOptions.revert !== "string") {
        options.revert = function(dropped: any) {
          let revert = originOptions.revert;
          if (revert == null) {
            revert = !dropped;
          } else {
            if (typeof revert === "function") {
              revert = revert.call(this, dropped);
            }
          }
          return revert;
        };
      }
      if (typeof originOptions.helper !== "string") {
        options.helper = function(evt: any) {
          let helper;
          if (typeof originOptions.helper === "function") {
            helper = originOptions.helper.apply(this, arguments);
          }
          if (doradoDraggable) {
            helper = doradoDraggable.onGetDraggingIndicator(helper, evt, this);
          }
          let draggingInfo = options.createDraggingInfo.call(this, evt);
          $fly(this).data("ui-draggable").draggingInfo = draggingInfo;
          if (helper instanceof dorado.DraggingIndicator) {
            draggingInfo.set("indicator", helper);
            helper = helper.getDom();
          }
          return helper;
        };
      }
      options.start = function(evt: any, ui: any) {
        let b = true;
        if (originOptions.start) {
          b = originOptions.start.apply(this, arguments);
        }
        if (b !== false) {
          let draggingInfo = dorado.DraggingInfo.getFromElement(this);
          if (draggingInfo) {
            draggingInfo._targetDroppables = [];
            if (doradoDraggable) {
              b = doradoDraggable.onDragStart(draggingInfo, evt);
              if (b !== false) {
                doradoDraggable.initDraggingInfo(draggingInfo, evt);
                let indicator = draggingInfo.get("indicator");
                if (indicator) {
                  doradoDraggable.initDraggingIndicator(indicator, draggingInfo, evt);
                }
              }
            }
          }
        }
        return b;
      };
      options.stop = function(evt: any, ui: any) {
        let b = true;
        if (originOptions.stop) {
          b = originOptions.stop.apply(this, arguments);
        }
        if (b !== false) {
          let draggingInfo = dorado.DraggingInfo.getFromElement(this);
          if (draggingInfo) {
            if (doradoDraggable) {
              b = doradoDraggable.onDragStop(draggingInfo, evt);
            }
            if (b !== false) {
              setTimeout(function() {
                let targetDroppable = draggingInfo._targetDroppables.peek();
                if (targetDroppable) {
                  targetDroppable.onDraggingSourceOut(draggingInfo, evt);
                }
              }, 20);
            }
          }
        }
        return b;
      };
      options.drag = function(evt: any, ui: any) {
        if (originOptions.drag) {
          originOptions.drag.apply(this, arguments);
        }
        let draggingInfo = dorado.DraggingInfo.getFromElement(this);
        if (draggingInfo) {
          if (doradoDraggable) {
            doradoDraggable.onDragMove(draggingInfo, evt);
          }
          let targetDroppable = draggingInfo._targetDroppables.peek();
          if (targetDroppable) {
            targetDroppable.onDraggingSourceMove(draggingInfo, evt);
          }
        }
      };
    }
    return oldDraggable.apply(this, arguments);
  };
  let oldDroppable = $.fn.droppable;
  $.fn.droppable = function(options: any) {
    let doradoDroppable = options ? options.doradoDroppable : null;
    if (doradoDroppable) {
      let originOptions = options;
      options = dorado.Object.apply({}, originOptions);
      options.over = function(evt: any, ui: any) {
        if (originOptions.over) {
          originOptions.over.apply(this, arguments);
        }
        if (doradoDroppable) {
          let draggingInfo = dorado.DraggingInfo.getFromJQueryUI(ui);
          if (draggingInfo) {
            if (draggingInfo._targetDroppables.peek() !== doradoDroppable) {
              draggingInfo._targetDroppables.push(doradoDroppable);
            }
            doradoDroppable.onDraggingSourceOver(draggingInfo, evt);
          }
        }
      };
      options.out = function(evt: any, ui: any) {
        if (originOptions.out) {
          originOptions.out.apply(this, arguments);
        }
        if (doradoDroppable) {
          let draggingInfo = dorado.DraggingInfo.getFromJQueryUI(ui);
          if (draggingInfo) {
            doradoDroppable.onDraggingSourceOut(draggingInfo, evt);
            if (draggingInfo._targetDroppables.peek() === doradoDroppable) {
              draggingInfo._targetDroppables.pop();
            }
          }
        }
      };
      options.drop = function(evt: any, ui: any) {
        let draggable = jQuery(ui.draggable).data("ui-draggable");
        if (!jQuery.ui.ddmanager.accept) {
          if (draggable && draggable.options.revert === "invalid") {
            draggable.options.revert = true;
            draggable.options.forceRevert = true;
          }
          return false;
        } else {
          if (draggable && draggable.options.forceRevert) {
            draggable.options.revert = "invalid";
            draggable.options.forceRevert = false;
          }
          let dropped = false;
          if (originOptions.drop) {
            dropped = originOptions.drop.apply(this, arguments);
          }
          if (!dropped && doradoDroppable) {
            let draggingInfo = dorado.DraggingInfo.getFromJQueryUI(ui);
            if (draggingInfo) {
              setTimeout(function() {
                if (doradoDroppable.beforeDraggingSourceDrop(draggingInfo, evt)) {
                  doradoDroppable.onDraggingSourceDrop(draggingInfo, evt);
                }
              }, 20);
            }
          }
          return true;
        }
      };
      options.accept = function(draggable: any) {
        let accept = originOptions.accept;
        if (accept) {
          if (typeof accept === "function") {
            accept = accept.apply(this, arguments);
          } else {
            accept = draggable.is(accept);
          }
        }
        return !!accept;
      };
    }
    return oldDroppable.call(this, options);
  };
  if (dorado.Browser.chrome || dorado.Browser.safari) {
    jQuery.ui.draggable.prototype.options.userSelectFix = true;
    $.ui.plugin.add("draggable", "userSelectFix", {start:function(evt: any, ui: any) {
        $DomUtils.disableUserSelection(document.body);
      }, stop:function(evt: any, ui: any) {
        $DomUtils.enableUserSelection(document.body);
      }});
  }
  jQuery.ui.draggable.prototype.options.iframeFix = true;
  jQuery.ui.draggable.prototype._mouseCapture = function(event: any) {
    let o = this.options;
    if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
      return false;
    }
    this.handle = this._getHandle(event);
    if (!this.handle) {
      return false;
    }
    $(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
      $("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth + "px", height:this.offsetHeight + "px", position:"absolute", opacity:"0.001", zIndex:9999}).css($(this).offset()).appendTo("body");
    });
    return true;
  };
})(jQuery);
dorado.Renderer = $class({$className:"dorado.Renderer", render:function(dom: any, arg: any) {
  }});
dorado.Renderer.NONE_RENDERER = new dorado.Renderer();
dorado.Renderer.render = function(renderer: any, dom: any, arg: any) {
  if (renderer instanceof dorado.Renderer) {
    renderer.render(dom, arg);
  } else {
    if (typeof renderer === "function") {
      renderer(dom, arg);
    }
  }
};
dorado.RenderableElement = $extend(dorado.AttributeSupport, {$className:"dorado.RenderableElement", _ignoreRefresh:0, ATTRIBUTES:{className:{writeBeforeReady:true}, exClassName:{skipRefresh:true, setter:function(v: any) {
        if (this._rendered && this._exClassName) {
          $fly(this.getDom()).removeClass(this._exClassName);
        }
        this._exClassName = v;
        if (this._rendered && v) {
          $fly(this.getDom()).addClass(v);
        }
      }}, width:{setter:function(v: any) {
        this._width = isFinite(v) ? parseInt(v) : v;
      }}, height:{setter:function(v: any) {
        this._height = isFinite(v) ? parseInt(v) : v;
      }}, style:{setter:function(v: any) {
        if (typeof v === "string" || !this._style) {
          this._style = v;
        } else {
          if (v) {
            dorado.Object.apply(this._style, v);
          }
        }
      }}, rendered:{readOnly:true}}, destroy:function() {
    let dom = this._dom;
    if (dom) {
      delete this._dom;
      if (dorado.windowClosed) {
        $fly(dom).unbind();
      } else {
        $fly(dom).remove();
      }
    }
    $invokeSuper.call(this);
  }, doSet:function(attr: any, value: any) {
    let errorMessage = $invokeSuper.call(this, [attr, value]);
    let def = this.ATTRIBUTES[attr];
    if (this._rendered && this._ignoreRefresh < 1 && def && !def.skipRefresh) {
      dorado.Toolkits.setDelayedAction(this, "$refreshDelayTimerId", this.refresh, 50);
    }
    return errorMessage;
  }, createDom:function() {
    return document.createElement("DIV");
  }, refreshDom:function(dom: any) {
    if (dom.nodeType !== 3) {
      this.applyStyle(dom);
      this.resetDimension();
    }
  }, resetDimension:function(forced: any) {
    let dom = this.getDom(), $dom = $fly(dom), changed = false;
    let width = this.getRealWidth();
    let height = this.getRealHeight();
    if (forced || width && this._currentWidth !== width) {
      if (width < 0) {
        this._currentWidth = null;
        dom.style.width = "";
      } else {
        this._currentWidth = width;
        if (this._useInnerWidth) {
          $dom.width(width);
        } else {
          $dom.outerWidth(width);
        }
      }
      changed = true;
    }
    if (forced || height && this._currentHeight !== height) {
      if (height < 0) {
        this._currentHeight = null;
        dom.style.height = "";
      } else {
        this._currentHeight = height;
        if (this._useInnerHeight) {
          $dom.height(height);
        } else {
          $dom.outerHeight(height);
        }
      }
      changed = true;
    }
    return changed;
  }, getRealWidth:function() {
    return (this._realWidth == null) ? this._width : this._realWidth;
  }, getRealHeight:function() {
    return (this._realHeight == null) ? this._height : this._realHeight;
  }, applyStyle:function(dom: any) {
    if (this._style) {
      let style = this._style;
      if (typeof this._style === "string") {
        let map = {};
        jQuery.each(style.split(";"), function(i: any, section: any) {
          i = section.indexOf(":");
          if (i > 0) {
            let attr = jQuery.trim(section.substring(0, i));
            let value = jQuery.trim(section.substring(i + 1));
            if (dorado.Browser.msie && attr.toLowerCase() === "filter") {
              dom.style.filter = value;
            } else {
              map[attr] = value;
            }
          }
        });
        style = map;
      }
      $fly(dom).css(style);
      delete this._style;
    }
  }, getDom:function() {
    if (!this._dom) {
      this._dom = this.createDom();
      let $dom = $fly(this._dom);
      let className = (this._inherentClassName) ? this._inherentClassName : "";
      if (this._className) {
        className += (" " + this._className);
      }
      if (this._exClassName) {
        className += (" " + this._exClassName);
      }
      if (className) {
        $dom.addClass(className);
      }
      this.applyStyle(this._dom);
    }
    return this._dom;
  }, doRenderToOrReplace:function(replace: any, element: any, nextChildElement: any) {
    let dom = this.getDom();
    if (!dom) {
      return;
    }
    if (replace) {
      if (!element.parentNode) {
        return;
      }
      element.parentNode.replaceChild(dom, element);
    } else {
      if (!element) {
        element = document.body;
      }
      if (dom.parentNode !== element || (nextChildElement && dom.nextSibling !== nextChildElement)) {
        if (nextChildElement) {
          element.insertBefore(dom, nextChildElement);
        } else {
          element.appendChild(dom);
        }
      }
    }
    this.refreshDom(dom);
    this._rendered = true;
  }, render:function(containerElement: any, nextChildElement: any) {
    this.doRenderToOrReplace(false, containerElement, nextChildElement);
  }, replace:function(elmenent: any) {
    this.doRenderToOrReplace(true, elmenent);
  }, unrender:function() {
    let dom = this.getDom();
    if (dom && dom.parentNode) {
      dom.parentNode.removeChild(dom);
    }
  }, refresh:function(delay: any) {
    if (!this._rendered) {
      return;
    }
    if (delay) {
      dorado.Toolkits.setDelayedAction(this, "$refreshDelayTimerId", function() {
        dorado.Toolkits.cancelDelayedAction(this, "$refreshDelayTimerId");
        this.refreshDom(this.getDom());
      }, 50);
    } else {
      dorado.Toolkits.cancelDelayedAction(this, "$refreshDelayTimerId");
      this.refreshDom(this.getDom());
    }
  }});
dorado.TagManager = {_map:{}, _register:function(tag: any, object: any) {
    if (!object._id) {
      object._id = dorado.Core.newId();
    }
    let info = this._map[tag];
    if (info) {
      if (!info.idMap[object._id]) {
        info.list.push(object);
        info.idMap[object._id] = object;
      }
    } else {
      this._map[tag] = info = {list:[object], idMap:{}};
      info.idMap[object._id] = object;
    }
  }, _unregister:function(tag: any, object: any) {
    let info = this._map[tag];
    if (info) {
      if (info.idMap[object._id]) {
        delete info.idMap[object._id];
        info.list.remove(object);
      }
    }
  }, _regOrUnreg:function(object: any, remove: any) {
    let tags = object._tags;
    if (tags) {
      if (typeof tags === "string") {
        tags = tags.split(",");
      }
      if (tags instanceof Array) {
        for (let i = 0; i < tags.length; i++) {
          let tag = tags[i];
          if (typeof tag === "string" && tag.length > 0) {
            remove ? this._unregister(tag, object) : this._register(tag, object);
          }
        }
      }
    }
  }, register:function(object: any) {
    this._regOrUnreg(object);
  }, unregister:function(object: any) {
    this._regOrUnreg(object, true);
  }, find:function(tags: any) {
    let info = this._map[tags];
    if (info) {
      let objects = info.list, object;
      for (let i = 0, len = objects.length; i < len; i++) {
        object = objects[i];
        if (object._lazyInit) {
          object._lazyInit();
        }
      }
      return new dorado.ObjectGroup(objects);
    } else {
      return new dorado.ObjectGroup(null);
    }
  }};
dorado.ObjectGroup = $class({constructor:function(objects: any) {
    if (objects && !(objects instanceof Array)) {
      objects = [objects];
    }
    this.objects = objects || [];
  }, set:function(attr: any, value: any) {
    if (!this.objects) {
      return;
    }
    for (let i = 0, len = this.objects.length; i < len; i++) {
      let object = this.objects[i];
      if (object) {
        object.set(attr, value, true);
      }
    }
    return this;
  }, get:function(attr: any) {
    let attrs = attr.split("."), objects = this.objects;
    for (let i = 0, len = attrs.length; i < len; i++) {
      let a = attrs[i], results = [];
      for (let j = 0; j < objects.length; j++) {
        let object = objects[j], result;
        if (!object) {
          continue;
        }
        if (typeof object.get === "function") {
          result = object.get(a);
        } else {
          result = object[a];
        }
        if (result != null) {
          results.push(result);
        }
      }
      objects = results;
    }
    return new dorado.ObjectGroup(objects);
  }, addListener:function(name: any, listener: any, options: any) {
    return this.bind(name, listener, options);
  }, removeListener:function(name: any, listener: any) {
    return this.unbind(name, listener);
  }, bind:function(name: any, listener: any, options: any) {
    if (!this.objects) {
      return;
    }
    for (let i = 0, len = this.objects.length; i < len; i++) {
      let object = this.objects[i];
      if (object && typeof object.bind === "function") {
        object.bind(name, listener, options);
      }
    }
  }, unbind:function(name: any, listener: any) {
    if (!this.objects) {
      return;
    }
    for (let i = 0, len = this.objects.length; i < len; i++) {
      let object = this.objects[i];
      if (object && object.unbind) {
        object.unbind(name, listener);
      }
    }
  }, invoke:function(methodName: any) {
    if (!this.objects) {
      return;
    }
    for (let i = 0, len = this.objects.length; i < len; i++) {
      let object = this.objects[i];
      if (object) {
        let method = object[methodName];
        if (typeof method === "function") {
          method.apply(object, Array.prototype.slice.call(arguments, 1));
        }
      }
    }
  }, each:function(callback: any) {
    if (!this.objects) {
      return;
    }
    this.objects.each(callback);
  }});
window.$group = function() {
  return new dorado.ObjectGroup(Array.prototype.slice.call(arguments));
};
window.$tag = function(tags: any) {
  return dorado.TagManager.find(tags);
};
dorado.Toolkits = {typesRegistry:{}, typeTranslators:{}, registerPrototype:function(namespace: any, name: any, constr: any) {
    if (typeof name === "object") {
      for (let p in name) {
        if (name.hasOwnProperty(p)) {
          this.typesRegistry[namespace + "." + p] = name[p];
        }
      }
    } else {
      this.typesRegistry[namespace + "." + name] = constr;
    }
  }, registerTypeTranslator:function(namespace: any, typeTranslator: any) {
    this.typeTranslators[namespace] = typeTranslator;
  }, getPrototype:function(namespace: any, name: any) {
    let ns = namespace.split(",");
    for (let i = 0; i < ns.length; i++) {
      let n = ns[i], constr = this.typesRegistry[n + "." + (name || "Default")];
      if (!constr) {
        let typeTranslator = this.typeTranslators[n];
        if (typeTranslator && typeof typeTranslator === "function") {
          constr = typeTranslator(name);
        }
      }
      if (constr) {
        return constr;
      }
    }
  }, createInstance:function(namespace: any, config: any, typeTranslator: any) {
    let type;
    if (typeof config === "string") {
      type = config;
      config = null;
    } else {
      type = config ? config.$type : undefined;
    }
    let constr = this.getPrototype(namespace, type);
    if (!constr) {
      if (typeTranslator && typeTranslator.constructor === String) {
        type = typeTranslator;
      }
      if (!constr) {
        if (typeTranslator && typeof typeTranslator === "function") {
          constr = typeTranslator(type);
        }
        if (!constr) {
          if (type) {
            constr = dorado.util.Common.getClassType(type);
          } else {
            throw new dorado.ResourceException("dorado.core.TypeUndefined");
          }
        }
      }
      if (constr && type) {
        this.registerPrototype(namespace, type, constr);
      }
    }
    if (!constr) {
      throw new dorado.ResourceException("dorado.core.UnknownType", type);
    }
    return new constr(config);
  }, setDelayedAction:function(owner: any, actionId: any, fn: any, timeMillis: any) {
    actionId = actionId || dorado.Core.newId();
    this.cancelDelayedAction(owner, actionId);
    owner[actionId] = $setTimeout(owner, fn, timeMillis);
  }, cancelDelayedAction:function(owner: any, actionId: any) {
    if (owner[actionId]) {
      clearTimeout(owner[actionId]);
      owner[actionId] = undefined;
      return true;
    }
    return false;
  }, STATE_CODE:{info:0, ok:1, warn:2, error:3, validating:99}, getTopMessage:function(messages: any) {
    if (!messages) {
      return null;
    }
    let topMessage = null, topStateCode = -1;
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];
      let code = this.STATE_CODE[message.state];
      if (code > topStateCode) {
        topStateCode = code;
        topMessage = message;
      }
    }
    return topMessage;
  }, getTopMessageState:function(messages: any) {
    if (!messages) {
      return null;
    }
    let topMessage = this.getTopMessage(messages);
    return topMessage ? topMessage.state : null;
  }, trimSingleMessage:function(message: any, defaultState: any) {
    if (!message) {
      return null;
    }
    if (typeof message === "string") {
      message = {state:defaultState, text:message};
    } else {
      message.state = message.state || defaultState;
    }
    return message;
  }, trimMessages:function(message: any, defaultState: any) {
    if (!message) {
      return null;
    }
    let result;
    if (message instanceof Array) {
      let array = [];
      for (let i = 0; i < message.length; i++) {
        let m = this.trimSingleMessage(message[i], defaultState);
        if (!m) {
          continue;
        }
        array.push(m);
      }
      result = (array.length) ? array : null;
    } else {
      result = [this.trimSingleMessage(message, defaultState)];
    }
    return result;
  }};
dorado.DraggingIndicator = $extend(dorado.RenderableElement, {$className:"dorado.DraggingIndicator", ATTRIBUTES:{className:{defaultValue:"d-dragging-indicator"}, accept:{skipRefresh:true, setter:function(v: any) {
        if (this._accept !== v) {
          this._accept = v;
          this.refresh();
        }
      }}, icon:{}, iconClass:{}, contentOffsetLeft:{defaultValue:20}, contentOffsetTop:{defaultValue:20}, content:{writeOnly:true, setter:function(content: any) {
        if (content instanceof jQuery) {
          content = content[0];
        }
        if (content) {
          content.style.position = "";
          content.style.left = 0;
          content.style.top = 0;
          content.style.right = 0;
          content.style.bottom = 0;
        }
        this._content = content;
      }}}, constructor:function(config: any) {
    $invokeSuper.call(this, arguments);
    if (config) {
      this.set(config);
    }
  }, createDom:function() {
    let dom = $DomUtils.xCreate({tagName:"div", content:[{tagName:"div", className:"content-container"}, {tagName:"div"}]});
    this._contentContainer = dom.firstChild;
    this._iconDom = dom.lastChild;
    return dom;
  }, refreshDom:function(dom: any) {
    $invokeSuper.call(this, arguments);
    let contentContainer = this._contentContainer, $contentContainer = $fly(this._contentContainer), content = this._content;
    $contentContainer.toggleClass("default-content", (content == null)).left(this._contentOffsetLeft || 0).top(this._contentOffsetTop || 0);
    if (content) {
      if (content.parentNode !== contentContainer) {
        $contentContainer.empty().append(content);
      }
    } else {
      $contentContainer.empty();
    }
    let w = contentContainer.offsetWidth + (this._contentOffsetLeft || 0);
    let h = contentContainer.offsetHeight + (this._contentOffsetTop || 0);
    $fly(dom).width(w).height(h);
    let iconDom = this._iconDom;
    $fly(iconDom).attr("class", "icon");
    let icon = this._icon, iconClass = this._iconClass;
    if (!icon && !iconClass) {
      iconClass = this._accept ? "accept-icon" : "denied-icon";
    }
    if (icon) {
      $DomUtils.setBackgroundImage(iconDom, icon);
    } else {
      if (iconClass) {
        $fly(iconDom).addClass(iconClass);
      }
    }
  }});
dorado.DraggingIndicator.create = function() {
  return new dorado.DraggingIndicator();
};
(function() {
  dorado.DraggingInfo = $extend(dorado.AttributeSupport, {$className:"dorado.DraggingInfo", ATTRIBUTES:{object:{setter:function(object: any) {
          this._object = object;
          this._insertMode = null;
          this._refObject = null;
        }}, element:{}, tags:{}, sourceControl:{}, targetObject:{}, targetControl:{}, insertMode:{}, refObject:{}, accept:{getter:function() {
          return jQuery.ui.ddmanager.accept;
        }, setter:function(accept: any) {
          if (this._indicator) {
            this._indicator.set("accept", accept);
          }
          jQuery.ui.ddmanager.accept = accept;
        }}, indicator:{}, options:{}}, constructor:function(options: any) {
      if (options) {
        this.set(options);
      }
      if (!this._tags) {
        this._tags = [];
      }
    }, isDropAcceptable:function(droppableTags: any) {
      if (droppableTags && droppableTags.length && this._tags.length) {
        for (let i = 0; i < droppableTags.length; i++) {
          if (this._tags.indexOf(droppableTags[i]) >= 0) {
            return true;
          }
        }
      }
      return false;
    }});
  dorado.DraggingInfo.getFromJQueryUI = function(ui: any) {
    return $fly(ui.draggable[0]).data("ui-draggable").draggingInfo;
  };
  dorado.DraggingInfo.getFromElement = function(element: any) {
    element = (element instanceof jQuery) ? element : $fly(element);
    return element.data("ui-draggable").draggingInfo;
  };
  dorado.Draggable = $class({$className:"dorado.Draggable", defaultDraggableOptions:{distance:5, revert:"invalid", cursorAt:{left:8, top:8}}, ATTRIBUTES:{draggable:{}, dragTags:{skipRefresh:true, setter:function(v: any) {
          if (typeof v === "string") {
            v = v.split(",");
          }
          this._dragTags = v || [];
        }}}, EVENTS:{onGetDraggingIndicator:{}, onDragStart:{}, onDragStop:{}, onDragMove:{}}, getDraggableOptions:function(dom: any) {
      let options = dorado.Object.apply({doradoDraggable:this}, this.defaultDraggableOptions);
      return options;
    }, applyDraggable:function(dom: any, options: any) {
      if (dom._currentDraggable !== this._draggable) {
        if (this._draggable) {
          options = options || this.getDraggableOptions(dom);
          $fly(dom).draggable(options);
        } else {
          if ($fly(dom).data("ui-draggable")) {
            $fly(dom).draggable("destroy");
          }
        }
        dom._currentDraggable = this._draggable;
      }
    }, createDraggingInfo:function(dom: any, options: any) {
      let info = new dorado.DraggingInfo({sourceControl:this, options:options, tags:this._dragTags});
      return info;
    }, initDraggingInfo:function(draggingInfo: any, evt: any) {
    }, initDraggingIndicator:function(indicator: any, draggingInfo: any, evt: any) {
    }, onGetDraggingIndicator:function(indicator: any, evt: any, draggableElement: any) {
      if (!indicator) {
        indicator = dorado.DraggingIndicator.create();
      }
      let eventArg = {indicator:indicator, event:evt, draggableElement:draggableElement};
      this.fireEvent("onGetDraggingIndicator", this, eventArg);
      indicator = eventArg.indicator;
      if (indicator instanceof dorado.DraggingIndicator) {
        if (!indicator.get("rendered")) {
          indicator.render();
        }
        let dom = indicator.getDom();
        $fly(dom).bringToFront();
      }
      return indicator;
    }, onDragStart:function(draggingInfo: any, evt: any) {
      let eventArg = {draggingInfo:draggingInfo, event:evt, processDefault:true};
      this.fireEvent("onDragStart", this, eventArg);
      return eventArg.processDefault;
    }, onDragStop:function(draggingInfo: any, evt: any) {
      let eventArg = {draggingInfo:draggingInfo, event:evt, processDefault:true};
      this.fireEvent("onDragStop", this, eventArg);
      return eventArg.processDefault;
    }, onDragMove:function(draggingInfo: any, evt: any) {
      let eventArg = {draggingInfo:draggingInfo, event:evt};
      this.fireEvent("onDragMove", this, eventArg);
    }});
  dorado.Droppable = $class({$className:"dorado.Droppable", defaultDroppableOptions:{accept:"*", greedy:true, tolerance:"pointer"}, ATTRIBUTES:{droppable:{}, droppableTags:{skipRefresh:true, setter:function(v: any) {
          if (typeof v === "string") {
            v = v.split(",");
          }
          this._droppableTags = v || [];
        }}}, EVENTS:{onDraggingSourceOver:{}, onDraggingSourceOut:{}, onDraggingSourceMove:{}, beforeDraggingSourceDrop:{}, onDraggingSourceDrop:{}}, getDroppableOptions:function(dom: any) {
      let options = dorado.Object.apply({doradoDroppable:this}, this.defaultDroppableOptions);
      return options;
    }, applyDroppable:function(dom: any, options: any) {
      if (dom._currentDroppable !== this._droppable) {
        if (this._droppable) {
          options = options || this.getDroppableOptions(dom);
          $fly(dom).droppable(options);
        } else {
          if ($fly(dom).data("ui-droppable")) {
            $fly(dom).droppable("destroy");
          }
        }
        dom._currentDroppable = this._droppable;
      }
    }, onDraggingSourceOver:function(draggingInfo: any, evt: any) {
      let accept = draggingInfo.isDropAcceptable(this._droppableTags);
      let eventArg = {draggingInfo:draggingInfo, event:evt, accept:accept};
      this.fireEvent("onDraggingSourceOver", this, eventArg);
      draggingInfo.set("accept", eventArg.accept);
      return eventArg.accept;
    }, onDraggingSourceOut:function(draggingInfo: any, evt: any) {
      let eventArg = {draggingInfo:draggingInfo, event:evt};
      this.fireEvent("onDraggingSourceOut", this, eventArg);
      draggingInfo.set({targetObject:null, insertMode:null, refObject:null, accept:false});
    }, onDraggingSourceMove:function(draggingInfo: any, evt: any) {
      let eventArg = {draggingInfo:draggingInfo, event:evt};
      this.fireEvent("onDraggingSourceMove", this, eventArg);
    }, beforeDraggingSourceDrop:function(draggingInfo: any, evt: any) {
      let eventArg = {draggingInfo:draggingInfo, event:evt, processDefault:true};
      this.fireEvent("beforeDraggingSourceDrop", this, eventArg);
      return eventArg.processDefault;
    }, onDraggingSourceDrop:function(draggingInfo: any, evt: any) {
      let eventArg = {draggingInfo:draggingInfo, event:evt};
      this.fireEvent("onDraggingSourceDrop", this, eventArg);
    }, getMousePosition:function(evt: any) {
      let offset = $fly(this.getDom()).offset();
      return {x:evt.pageX - offset.left, y:evt.pageY - offset.top};
    }});
})();
dorado.ModalManager = {_controlStack:[], getMask:function() {
    let manager = dorado.ModalManager, maskDom = manager._dom;
    if (!maskDom) {
      maskDom = manager._dom = document.createElement("div");
      $fly(maskDom).mousedown(function(evt: any) {
        let repeat = function(fn: any, times: any, delay: any) {
          let first = true;
          return function() {
            if (times-- >= 0) {
              if (first) {
                first = false;
              } else {
                fn.apply(null, arguments);
              }
              let args = Array.prototype.slice.call(arguments);
              let self = arguments.callee;
              setTimeout(function() {
                self.apply(null, args);
              }, delay);
            }
          };
        };
        if (!dorado.Browser.msie && evt.target === maskDom) {
          let stack = manager._controlStack, stackEl = stack[stack.length - 1], dom;
          if (stackEl) {
            dom = stackEl.dom;
          }
          if (dom) {
            let control = dorado.widget.Control.findParentControl(dom);
            if (control) {
              let count = 1, fn = repeat(function() {
                dorado.widget.setFocusedControl(count++ % 2 === 1 ? control : null);
              }, 3, 100);
              fn();
            }
          }
        }
      }).mouseenter(function(evt: any) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.returnValue = false;
        return false;
      }).mouseleave(function(evt: any) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.returnValue = false;
        return false;
      });
      $fly(document.body).append(maskDom);
    }
    manager.resizeMask();
    return maskDom;
  }, resizeMask:function() {
    let manager = dorado.ModalManager, maskDom = manager._dom;
    if (maskDom) {
      let doc = maskDom.ownerDocument, bodyHeight = $fly(doc).height(), bodyWidth;
      if (dorado.Browser.msie) {
        if (dorado.Browser.version === 6) {
          bodyWidth = $fly(doc).width() - (parseInt($fly(doc.body).css("margin-left"), 10) || 0) - (parseInt($fly(doc.body).css("margin-right"), 10) || 0);
          $fly(maskDom).width(bodyWidth - 2).height(bodyHeight - 4);
        } else {
          if (dorado.Browser.version === 7) {
            $fly(maskDom).height(bodyHeight);
          } else {
            $fly(maskDom).height(bodyHeight - 4);
          }
        }
      } else {
        $fly(maskDom).height(bodyHeight - 4);
      }
    }
  }, show:function(dom: any, maskClass: any) {
    let manager = dorado.ModalManager, stack = manager._controlStack, maskDom = manager.getMask();
    if (dom) {
      maskClass = maskClass || "d-modal-mask";
      $fly(maskDom).css({display:""}).bringToFront();
      stack.push({dom:dom, maskClass:maskClass, zIndex:maskDom.style.zIndex});
      $fly(dom).bringToFront();
      setTimeout(function() {
        $fly(maskDom).prop("class", maskClass);
      }, 0);
    }
  }, hide:function(dom: any) {
    let manager = dorado.ModalManager, stack = manager._controlStack, maskDom = manager.getMask();
    if (dom) {
      if (stack.length > 0) {
        let target = stack[stack.length - 1];
        if (target && target.dom === dom) {
          stack.pop();
        } else {
          for (let i = 0, j = stack.length; i < j; i++) {
            if (dom === (stack[i] || {}).dom) {
              stack.removeAt(i);
              break;
            }
          }
        }
        if (stack.length === 0) {
          $fly(maskDom).prop("class", "").css("display", "none");
        } else {
          target = stack[stack.length - 1];
          $fly(maskDom).css({zIndex:target.zIndex}).prop("class", target.maskClass);
        }
      }
    }
  }};
$fly(window).bind("resize", function() {
  if (dorado.ModalManager.onResizeTimerId) {
    clearTimeout(dorado.ModalManager.onResizeTimerId);
    delete dorado.ModalManager.onResizeTimerId;
  }
  dorado.ModalManager.onResizeTimerId = setTimeout(function() {
    delete dorado.ModalManager.onResizeTimerId;
    dorado.ModalManager.resizeMask();
  }, 20);
});
dorado.util.TaskIndicator = {type:null, idseed:0, _taskGroups:{}, init:function() {
    if (this.inited) {
      return;
    }
    this.inited = true;
    let mainType = $setting["common.taskIndicator.main.type"] || "panel";
    let daemonType = $setting["common.taskIndicator.daemon.type"] || "panel";
    let taskGroupConfig = {type:mainType, modal:true};
    if (mainType === "icon") {
      taskGroupConfig.showOptions = {align:"center", vAlign:"center"};
      taskGroupConfig.className = "d-main-task-indicator";
    } else {
      if (mainType === "panel") {
        taskGroupConfig.showOptions = {align:"center", vAlign:"center"};
        taskGroupConfig.className = "d-main-task-indicator";
      }
    }
    this.registerTaskGroup("main", taskGroupConfig);
    taskGroupConfig = {type:daemonType};
    if (daemonType === "icon") {
      taskGroupConfig.showOptions = {align:"innerright", vAlign:"innertop", offsetLeft:-15, offsetTop:15};
      taskGroupConfig.className = "d-daemon-task-indicator";
    } else {
      if (mainType === "panel") {
        taskGroupConfig.showOptions = {align:"innerright", vAlign:"innertop", offsetLeft:-15, offsetTop:15};
        taskGroupConfig.className = "d-daemon-task-indicator";
      }
    }
    this.registerTaskGroup("daemon", taskGroupConfig);
  }, registerTaskGroup:function(groupName: any, options: any) {
    let indicator = this, taskGroups = indicator._taskGroups;
    if (taskGroups[groupName]) {
    } else {
      options = options || {};
      taskGroups[groupName] = options;
    }
  }, showTaskIndicator:function(taskInfo: any, groupName: any, startTime: any) {
    this.init();
    let indicator = this, taskGroups = indicator._taskGroups, taskGroupConfig;
    groupName = groupName || "daemon";
    taskGroupConfig = taskGroups[groupName];
    if (taskGroupConfig) {
      let groupPanel = taskGroupConfig.groupPanel;
      if (!groupPanel) {
        groupPanel = taskGroupConfig.groupPanel = new dorado.util.TaskGroupPanel(taskGroupConfig);
      }
      let taskId = groupName + "@" + ++indicator.idseed;
      groupPanel.show();
      groupPanel.addTask(taskId, taskInfo, startTime);
      return taskId;
    } else {
      return null;
    }
  }, updateTaskIndicator:function(taskId: any, taskInfo: any, startTime: any) {
    let indicator = this, taskGroups = indicator._taskGroups, taskGroupName, taskGroupConfig;
    taskGroupName = taskId.substring(0, taskId.indexOf("@"));
    taskGroupConfig = taskGroups[taskGroupName];
    if (taskGroupConfig) {
      let groupPanel = taskGroupConfig.groupPanel;
      if (groupPanel) {
        groupPanel.updateTask(taskId, taskInfo, startTime);
      }
    }
  }, hideTaskIndicator:function(taskId: any) {
    let indicator = this, taskGroups = indicator._taskGroups, taskGroupName, taskGroupConfig;
    taskGroupName = taskId.substring(0, taskId.indexOf("@"));
    taskGroupConfig = taskGroups[taskGroupName];
    if (taskGroupConfig) {
      let groupPanel = taskGroupConfig.groupPanel;
      if (groupPanel) {
        groupPanel.removeTask(taskId);
      }
    }
  }};
dorado.util.TaskGroupPanel = $extend(dorado.RenderableElement, {$className:"dorado.util.TaskGroupPanel", tasks:null, taskGroupConfig:null, _intervalId:null, ATTRIBUTES:{className:{defaultValue:"d-task-group"}}, constructor:function(taskGroupConfig: any) {
    $invokeSuper.call(this);
    let panel = this;
    if (!taskGroupConfig) {
      throw new dorado.Exception("taskGroupRequired");
    }
    panel.taskGroupConfig = taskGroupConfig;
    panel.tasks = new dorado.util.KeyedArray(function(object: any) {
      return object.taskId;
    });
  }, createDom:function() {
    let panel = this, dom, doms = {}, taskGroupConfig = panel.taskGroupConfig;
    if (taskGroupConfig.type === "bar") {
      dom = null;
    } else {
      if (taskGroupConfig.type === "icon") {
        dom = $DomUtils.xCreate({tagName:"div", className:panel._className + " " + panel._className + "-" + taskGroupConfig.type + " " + taskGroupConfig.className, content:{tagName:"div", className:"icon", content:{tagName:"div", className:"spinner"}}});
      } else {
        dom = $DomUtils.xCreate({tagName:"div", className:panel._className + " " + panel._className + "-" + taskGroupConfig.type + " " + taskGroupConfig.className, content:[{tagName:"div", className:"icon", content:{tagName:"div", className:"spinner"}}, {tagName:"div", className:"count-info", contextKey:"countInfo"}, {tagName:"ul", className:"task-list", contextKey:"taskList", content:{tagName:"li", className:"more", content:"... ... ...", contextKey:"more", style:"display: none"}}]}, null, doms);
        panel._doms = doms;
        taskGroupConfig.caption = taskGroupConfig.caption ? taskGroupConfig.caption : $resource("dorado.core.DefaultTaskCountInfo");
        taskGroupConfig.executeTimeCaption = taskGroupConfig.executeTimeCaption ? taskGroupConfig.executeTimeCaption : $resource("dorado.core.DefaultTaskExecuteTime");
      }
    }
    return dom;
  }, addTask:function(taskId: any, taskInfo: any, startTime: any) {
    startTime = (startTime || new Date()).getTime();
    let time = (new Date()).getTime();
    let panel = this, taskGroupConfig = panel.taskGroupConfig;
    if (taskGroupConfig.type === "panel") {
      let listDom = panel._doms.taskList, li = $DomUtils.xCreate({tagName:"li", className:"task-item", content:[{tagName:"span", className:"interval-span", content:taskGroupConfig.executeTimeCaption.replace("${taskExecuteTime}", parseInt((time - startTime) / 1000, 10))}, {tagName:"span", className:"caption-span", content:taskInfo}]});
      if (panel.tasks.size >= (panel.taskGroupConfig.showOptions.maxLines || 3)) {
        li.style.display = "none";
        panel._doms.more.style.display = "";
      }
      listDom.insertBefore(li, panel._doms.more);
      if (panel.tasks.size === 0) {
        panel._intervalId = setInterval(function() {
          panel.refreshInterval();
        }, 500);
      }
    }
    panel.tasks.append({taskId:taskId, dom:li, startTime:startTime});
    if (taskGroupConfig.type === "panel") {
      $fly(panel._doms.countInfo).text(taskGroupConfig.caption.replace("${taskNum}", panel.tasks.size));
    }
  }, updateTask:function(taskId: any, taskInfo: any, startTime: any) {
    let panel = this, target = panel.tasks.get(taskId), taskGroupConfig = panel.taskGroupConfig;
    if (target) {
      if (startTime) {
        target.startTime = startTime;
      }
      if (taskGroupConfig.type === "panel") {
        if (target.dom) {
          $fly(target.dom).find(">.caption-span")[0].innerText = taskInfo;
        }
      }
    }
  }, removeTask:function(taskId: any) {
    let panel = this, target = panel.tasks.get(taskId), taskGroupConfig = panel.taskGroupConfig;
    if (target) {
      if (taskGroupConfig.type === "bar" || taskGroupConfig.type === "icon") {
        panel.tasks.remove(target);
        if (panel.tasks.size === 0) {
          panel.hide();
        }
      } else {
        if (taskGroupConfig.type === "panel") {
          setTimeout(function() {
            $fly(target.dom).remove();
            panel.tasks.remove(target);
            let maxLines = panel.taskGroupConfig.showOptions.maxLines || 3;
            if (panel.tasks.size > maxLines) {
              let i = 0;
              panel.tasks.each(function(task: any) {
                task.dom.style.display = "";
                if (++i === maxLines) {
                  return false;
                }
              });
            } else {
              panel._doms.more.style.display = "none";
              if (panel.tasks.size === 0) {
                clearInterval(panel._intervalId);
                panel._intervalId = null;
                panel.hide();
              } else {
                panel.tasks.each(function(task: any) {
                  task.dom.style.display = "";
                });
              }
            }
            $fly(panel._doms.countInfo).text(taskGroupConfig.caption.replace("${taskNum}", panel.tasks.size));
          }, 50);
        }
      }
    }
  }, refreshInterval:function() {
    let panel = this, time = new Date().getTime();
    panel.tasks.each(function(task: any) {
      let el = task.dom, startTime = task.startTime;
      if (el && startTime) {
        let interval = parseInt((time - startTime) / 1000, 10);
        $fly(el).find(".interval-span").text(panel.taskGroupConfig.executeTimeCaption.replace("${taskExecuteTime}", interval));
      }
    });
  }, show:function(options: any) {
    let panel = this, taskGroupConfig = panel.taskGroupConfig;
    options = options || taskGroupConfig.showOptions;
    if (panel._hideTimer) {
      clearTimeout(panel._hideTimer);
      panel._hideTimer = null;
      return;
    }
    if (taskGroupConfig.type === "bar") {
      if (!panel._rendered) {
        panel._rendered = true;
        NProgress.configure({positionUsing:(dorado.Browser.isTouch && dorado.Browser.version < "535.0") ? "margin" : ""});
        panel._dom = NProgress.render(true);
      }
      NProgress.start();
    } else {
      if (!panel._rendered) {
        panel.render(document.body);
      } else {
        $fly(panel._dom).css("display", "").css("visibility", "");
      }
    }
    if (panel.tasks.size === 0 && taskGroupConfig.modal) {
      dorado.ModalManager.show(panel._dom);
    }
    $fly(panel._dom).bringToFront();
    if (options) {
      try {
        $DomUtils.dockAround(panel._dom, document.body, options);
      }
      catch (e) {
      }
    }
  }, hide:function() {
    let panel = this;
    let taskGroupConfig = panel.taskGroupConfig;
    if (taskGroupConfig.type === "bar") {
      NProgress.done();
    } else {
      if (panel._rendered) {
        jQuery(panel._dom).css("display", "none").css("visibility", "hidden");
      }
    }
    if (taskGroupConfig.modal) {
      dorado.ModalManager.hide(panel._dom);
    }
  }});
(function($: any) {
  let SCROLLER_SIZE, SCROLLER_EXPANDED_SIZE;
  let SCROLLER_PADDING = 0, MIN_SLIDER_SIZE = SCROLLER_EXPANDED_SIZE, MIN_SPILLAGE = 2;
  function insertAfter(element: any, refElement: any) {
    let parent = refElement.parentNode;
    if (parent.lastChild === refElement) {
      parent.appendChild(element);
    } else {
      parent.insertBefore(element, refElement.nextSibling);
    }
  }
  dorado.util.Dom.ThinScroller = $class({constructor:function(container: any, direction: any, options: any) {
      this.container = container;
      this.direction = direction;
      if (options) {
        dorado.Object.apply(this, options);
      }
    }, destroy:function() {
      delete this.dom;
      delete this.doms;
      delete this.container;
    }, createDom:function() {
      let scroller = this, doms = scroller.doms = {}, dom = scroller.dom = $DomUtils.xCreate({tagName:"DIV", className:"d-modern-scroller", style:"position: absolute", content:[{tagName:"DIV", contextKey:"track", className:"track", style:{width:"100%", height:"100%"}}, {tagName:"DIV", contextKey:"slider", className:"slider", style:"position: absolute"}]}, null, doms);
      let $dom = $(dom), slider = doms.slider, $slider = $(slider), track = doms.track, $track = $(track);
      let draggableOptions = {containment:"parent", start:function() {
          scroller.dragging = true;
        }, stop:function() {
          (scroller.hover) ? scroller.doMouseEnter() : scroller.doMouseLeave();
          scroller.dragging = false;
        }, drag:function() {
          let container = scroller.container;
          if (scroller.direction === "h") {
            container.scrollLeft = Math.round(slider.offsetLeft * scroller.positionRatio);
          } else {
            container.scrollTop = Math.round(slider.offsetTop * scroller.positionRatio);
          }
        }};
      if (scroller.direction === "h") {
        dom.style.height = SCROLLER_SIZE + "px";
        slider.style.height = "100%";
        slider.style.top = "0px";
        draggableOptions.axis = "x";
      } else {
        dom.style.width = SCROLLER_SIZE + "px";
        slider.style.width = "100%";
        slider.style.left = "0px";
        draggableOptions.axis = "y";
      }
      $slider.draggable(draggableOptions);
      $dom.hover(function() {
        scroller.update();
        scroller.doMouseEnter();
      }, function() {
        scroller.doMouseLeave();
      });
      $track.click(function(evt: any) {
        let container = scroller.container;
        if (scroller.direction === "h") {
          if (evt.offsetX > slider.offsetLeft) {
            container.scrollLeft += container.clientWidth;
          } else {
            container.scrollLeft -= container.clientWidth;
          }
        } else {
          if (evt.offsetY > slider.offsetTop) {
            container.scrollTop += container.clientHeight;
          } else {
            container.scrollTop -= container.clientHeight;
          }
        }
      });
      $DomUtils.disableUserSelection(dom);
      $DomUtils.disableUserSelection(doms.track);
      return dom;
    }, doMouseEnter:function() {
      let scroller = this;
      scroller.hover = true;
      if (scroller.dragging) {
        return;
      }
      $fly(scroller.dom).addClass("d-modern-scroller-hover");
      scroller.expand();
    }, doMouseLeave:function() {
      let scroller = this;
      scroller.hover = false;
      if (scroller.dragging) {
        return;
      }
      $fly(scroller.dom).removeClass("d-modern-scroller-hover");
      scroller.unexpand();
    }, expand:function() {
      let scroller = this;
      dorado.Toolkits.cancelDelayedAction(scroller, "$expandTimerId");
      if (scroller.expanded) {
        return;
      }
      let animOptions;
      if (scroller.direction === "h") {
        animOptions = {height:SCROLLER_EXPANDED_SIZE};
      } else {
        animOptions = {width:SCROLLER_EXPANDED_SIZE};
      }
      scroller.expanded = true;
      let $dom = $(scroller.dom);
      $dom.addClass("d-modern-scroller-expand");
      if (dorado.Browser.msie && dorado.Browser.version < 7) {
        $dom.css(animOptions);
      } else {
        scroller.duringAnimation = true;
        $dom.animate(animOptions, 0, function() {
          scroller.duringAnimation = false;
        });
      }
    }, unexpand:function() {
      let scroller = this;
      dorado.Toolkits.setDelayedAction(scroller, "$expandTimerId", function() {
        let animOptions, container = scroller.container;
        if (scroller.direction === "h") {
          animOptions = {height:SCROLLER_SIZE};
        } else {
          animOptions = {width:SCROLLER_SIZE};
        }
        let $dom = $(scroller.dom);
        if (dorado.Browser.msie && dorado.Browser.version < 7) {
          $dom.css(animOptions);
          scroller.expanded = false;
        } else {
          scroller.duringAnimation = true;
          $dom.animate(animOptions, 300, function() {
            scroller.expanded = false;
            scroller.duringAnimation = false;
            $dom.removeClass("d-modern-scroller-expand");
          });
        }
      }, 700);
    }, update:function() {
      let scroller = this, container = scroller.container;
      if (!container) {
        return;
      }
      let dom = scroller.dom, $container = $(container), scrollerSize = scroller.expanded ? SCROLLER_EXPANDED_SIZE : SCROLLER_SIZE;
      if (scroller.direction === "h") {
        if (container.scrollWidth > (container.clientWidth + MIN_SPILLAGE) && container.clientWidth > 0) {
          if (!dom) {
            dom = scroller.createDom();
            dom.style.zIndex = 9999;
            dom.style.bottom = 0;
            dom.style.left = 0;
            if (!dorado.Browser.msie || dorado.Browser.version !== 6) {
              dom.style.width = "100%";
            }
            container.parentNode.appendChild(dom);
          } else {
            dom.style.display = "";
          }
          if (dorado.Browser.msie && dorado.Browser.version === 6) {
            dom.style.width = container.offsetWidth + "px";
          }
          let trackSize = container.offsetWidth - SCROLLER_PADDING * 2;
          let slider = scroller.doms.slider;
          let sliderSize = (trackSize * container.clientWidth / container.scrollWidth);
          if (sliderSize < MIN_SLIDER_SIZE) {
            trackSize -= (MIN_SLIDER_SIZE - sliderSize);
            sliderSize = MIN_SLIDER_SIZE;
          }
          scroller.positionRatio = container.scrollWidth / trackSize;
          slider.style.left = Math.round(container.scrollLeft / scroller.positionRatio) + "px";
          slider.style.width = Math.round(sliderSize) + "px";
        } else {
          if (dorado.Browser.msie && dorado.Browser.version === 9 && container.offsetWidth > 0) {
            setTimeout(function() {
              scroller.update();
            }, 0);
          }
          if (dom) {
            dom.style.display = "none";
          }
        }
      } else {
        if (container.scrollHeight > (container.clientHeight + MIN_SPILLAGE) && container.clientHeight > 0) {
          if (!dom) {
            dom = scroller.createDom();
            dom.style.zIndex = 9999;
            dom.style.top = 0;
            dom.style.right = 0;
            if (!dorado.Browser.msie || dorado.Browser.version !== 6) {
              dom.style.height = "100%";
            }
            container.parentNode.appendChild(dom);
          } else {
            dom.style.display = "";
          }
          if (dorado.Browser.msie && dorado.Browser.version === 6) {
            dom.style.height = container.offsetHeight + "px";
          }
          let trackSize = container.offsetHeight - SCROLLER_PADDING * 2;
          let slider = scroller.doms.slider;
          let sliderSize = (trackSize * container.clientHeight / container.scrollHeight);
          if (sliderSize < MIN_SLIDER_SIZE) {
            trackSize -= (MIN_SLIDER_SIZE - sliderSize);
            sliderSize = MIN_SLIDER_SIZE;
          }
          scroller.positionRatio = container.scrollHeight / trackSize;
          slider.style.top = Math.round(container.scrollTop / scroller.positionRatio) + "px";
          slider.style.height = Math.round(sliderSize) + "px";
        } else {
          if (dorado.Browser.msie && dorado.Browser.version === 9 && container.offsetHeight > 0) {
            setTimeout(function() {
              scroller.update();
            }, 0);
          }
          if (dom) {
            dom.style.display = "none";
          }
        }
      }
      if (scroller.dragging) {
        if (scroller._updateTimerId) {
          clearTimeout(scroller._updateTimerId);
          delete scroller._updateTimerId;
        }
        scroller._updateTimerId = setTimeout(function() {
          if (scroller.dragging) {
            let draggable = $fly(scroller.doms.slider).data("ui-draggable");
            draggable._cacheHelperProportions();
            draggable._setContainment();
          }
        }, 200);
      }
    }});
  let ModernScroller = dorado.util.Dom.ModernScroller = $class({constructor:function(container: any, options: any) {
      this.id = dorado.Core.newId();
      this.container = container;
      this.options = options || {};
      let $container = $(container);
      options = this.options;
      if (options.listenSize || options.listenContainerSize || options.listenContentSize) {
        addListenModernScroller(this);
      }
    }, destroy:function() {
      this.destroyed = true;
      let options = this.options;
      if (options.listenSize || options.listenContainerSize || options.listenContentSize) {
        removeListenModernScroller(this);
      }
      delete this.container;
    }, setScrollLeft:dorado._NULL_FUNCTION, setScrollTop:dorado._NULL_FUNCTION, scrollToElement:dorado._NULL_FUNCTION});
  dorado.util.Dom.DesktopModernScroller = $extend(ModernScroller, {constructor:function(container: any, options: any) {
      $invokeSuper.call(this, arguments);
      options = this.options;
      let $container = $(container), parentDom = container.parentNode, $parentDom = $(parentDom);
      let overflowX = $container.css("overflowX"), overflowY = $container.css("overflowY");
      let width = $container.css("width"), height = $container.css("height");
      let xScroller, yScroller;
      if (!(overflowX === "hidden" || !dorado.Browser.isTouch && overflowX !== "scroll" && (width === "" || width === "auto"))) {
        $container.css("overflowX", "hidden");
        xScroller = new dorado.util.Dom.ThinScroller(container, "h", options);
      }
      if (!(overflowY === "hidden" || !dorado.Browser.isTouch && overflowY !== "scroll" && (height === "" || height === "auto"))) {
        $container.css("overflowY", "hidden");
        yScroller = new dorado.util.Dom.ThinScroller(container, "v", options);
      }
      if (!xScroller && !yScroller) {
        throw new dorado.AbortException();
      }
      this.xScroller = xScroller;
      this.yScroller = yScroller;
      let position = $parentDom.css("position");
      if (position !== "relative" && position !== "absolute") {
        $parentDom.css("position", "relative");
      }
      position = $container.css("position");
      if (position !== "relative" && position !== "absolute") {
        $container.css("position", "relative");
      }
      this.update();
      let modernScroller = this;
      if ($container.mousewheel) {
        $container.mousewheel(function(evt: any, delta: any) {
          if (container.scrollHeight > container.clientHeight) {
            let scrollTop = container.scrollTop - delta * 25;
            if (scrollTop <= 0) {
              scrollTop = 0;
            } else {
              if (scrollTop + container.clientHeight > container.scrollHeight) {
                scrollTop = container.scrollHeight - container.clientHeight;
              }
            }
            let gap = container.scrollTop - scrollTop;
            if (gap) {
              container.scrollTop = scrollTop;
              if (Math.abs(gap) > MIN_SPILLAGE) {
                return false;
              }
            }
          }
        });
      }
      $container.bind("scroll", function(evt: any) {
        if (!(xScroller && xScroller.dragging || yScroller && yScroller.dragging)) {
          modernScroller.update();
        }
        let arg = {scrollLeft:container.scrollLeft, scrollTop:container.scrollTop, scrollWidth:container.scrollWidth, scrollHeight:container.scrollHeight, clientWidth:container.clientWidth, clientHeight:container.clientHeight};
        $(container).trigger("modernScrolling", arg).trigger("modernScrolled", arg);
      }).resize(function(evt: any) {
        modernScroller.update();
      });
    }, update:function() {
      if (this.destroyed) {
        return;
      }
      if (this.xScroller && this.xScroller.dragging) {
        return;
      }
      if (this.yScroller && this.yScroller.dragging) {
        return;
      }
      if (this.xScroller) {
        this.xScroller.update();
      }
      if (this.yScroller) {
        this.yScroller.update();
      }
      let container = this.container;
      this.currentClientWidth = container.clientWidth;
      this.currentClientHeight = container.clientHeight;
      this.currentScrollWidth = container.scrollWidth;
      this.currentScrollHeight = container.scrollHeight;
    }, setScrollLeft:function(pos: any) {
      this.container.scrollLeft = pos;
    }, setScrollTop:function(pos: any) {
      this.container.scrollTop = pos;
    }, scrollToElement:function(dom: any) {
      let container = this.container, offsetElement = $fly(dom).offset(), offsetContainer = $fly(container).offset();
      let offsetLeft = offsetElement.left - offsetContainer.left, offsetTop = offsetElement.top - offsetContainer.top;
      let offsetRight = offsetLeft + dom.offsetWidth, offsetBottom = offsetTop + dom.offsetHeight;
      let scrollLeft = container.scrollLeft, scrollTop = container.scrollTop;
      let scrollRight = scrollLeft + container.clientWidth, scrollBottom = scrollTop + container.clientHeight;
      if (offsetLeft < scrollLeft) {
        if (offsetRight <= scrollRight) {
          this.setScrollLeft(offsetLeft);
        }
      } else {
        if (offsetRight > scrollRight) {
          this.setScrollLeft(offsetRight + dom.offsetWidth);
        }
      }
      if (offsetTop < scrollTop) {
        if (offsetBottom <= scrollBottom) {
          this.setScrollTop(offsetTop);
        }
      } else {
        if (offsetBottom > scrollBottom) {
          this.setScrollTop(offsetBottom + dom.offsetHeight);
        }
      }
    }, destroy:function() {
      $invokeSuper.call(this, arguments);
      if (this.xScroller) {
        this.xScroller.destroy();
      }
      if (this.yScroller) {
        this.yScroller.destroy();
      }
    }});
  dorado.util.Dom.IScrollerWrapper = $extend(ModernScroller, {constructor:function(container: any, options: any) {
      let $container = $(container);
      let overflowX = $container.css("overflowX"), overflowY = $container.css("overflowY");
      let width = $container.css("width"), height = $container.css("height");
      options = options || {};
      if (options.autoDisable === undefined) {
        options.autoDisable = true;
      }
      let onScrolling = function() {
        let arg = {scrollLeft:this.x * -1, scrollTop:this.y * -1, scrollWidth:container.scrollWidth, scrollHeight:container.scrollHeight, clientWidth:container.clientWidth, clientHeight:container.clientHeight};
        $container.trigger("modernScrolling", arg);
      };
      let modernScroller = this;
      options = modernScroller.options = dorado.Object.apply({scrollbarClass:"iscroll", hideScrollbar:true, fadeScrollbar:true, onScrolling:onScrolling, onScrollMove:onScrolling, onScrollEnd:function() {
          let arg = {scrollLeft:this.x * -1, scrollTop:this.y * -1, scrollWidth:container.scrollWidth, scrollHeight:container.scrollHeight, clientWidth:container.clientWidth, clientHeight:container.clientHeight};
          $container.trigger("modernScrolled", arg);
        }}, options, false);
      $container.css("overflowX", "hidden").css("overflowY", "hidden");
      setTimeout(function() {
        modernScroller.iscroll = new iScroll(container, modernScroller.options);
        if (options.autoDisable && container.scrollHeight <= (container.clientHeight + 2) && (container.scrollWidth <= container.clientWidth + 2)) {
          modernScroller.iscroll.disable();
        }
      }, 0);
      $invokeSuper.call(modernScroller, [container, modernScroller.options]);
      $container = $(container);
      $container.bind("scroll", function(evt: any) {
        modernScroller.update();
      }).resize(function(evt: any) {
        modernScroller.update();
      });
    }, update:function() {
      if (!this.iscroll || this.destroyed || this.dragging) {
        return;
      }
      let iscroll = this.iscroll;
      if (this.options.autoDisable) {
        let container = this.container;
        if (container.scrollHeight - (iscroll.y || 0) > (container.clientHeight + 2) || container.scrollWidth - (iscroll.x || 0) > (container.clientWidth + 2)) {
          this.iscroll.enable();
          this.iscroll.refresh();
        } else {
          this.iscroll.disable();
          this.iscroll.refresh();
        }
      } else {
        this.iscroll.refresh();
      }
    }, scrollToElement:function(dom: any) {
      if (this.iscroll) {
        this.iscroll.scrollToElement(dom);
      }
    }});
  let listenModernScrollers = new dorado.util.KeyedList(dorado._GET_ID), listenTimerId;
  function addListenModernScroller(modernScroller: any) {
    listenModernScrollers.insert(modernScroller);
    if (listenModernScrollers.size === 1) {
      listenTimerId = setInterval(function() {
        listenModernScrollers.each(function(modernScroller: any) {
          let container = modernScroller.container, shouldUpdate = false;
          if (!container) {
            return;
          }
          if (modernScroller.options.listenSize || modernScroller.options.listenContainerSize) {
            if (modernScroller.currentClientWidth !== container.clientWidth || modernScroller.currentClientHeight !== container.clientHeight) {
              shouldUpdate = true;
            }
          }
          if (modernScroller.options.listenSize || modernScroller.options.listenContentSize) {
            if (modernScroller.currentScrollWidth !== container.scrollWidth || modernScroller.currentScrollHeight !== container.scrollHeight) {
              shouldUpdate = true;
            }
          }
          if (shouldUpdate) {
            modernScroller.update();
          }
        });
      }, 300);
    }
  }
  function removeListenModernScroller(modernScroller: any) {
    listenModernScrollers.remove(modernScroller);
    if (listenModernScrollers.size === 0 && listenTimerId) {
      clearInterval(listenTimerId);
      listenTimerId = 0;
    }
  }
  dorado.util.Dom.modernScroll = function(container: any, options: any) {
    if (SCROLLER_SIZE === undefined) {
      SCROLLER_SIZE = $setting["widget.scrollerSize"] || 4;
    }
    if (SCROLLER_EXPANDED_SIZE === undefined) {
      SCROLLER_EXPANDED_SIZE = $setting["widget.scrollerExpandedSize"] || 16;
    }
    let $container = $(container);
    if ($container.data("modernScroller")) {
      return;
    }
    try {
      let modernScroller;
      let parentDom = container.parentNode;
      if (parentDom) {
        if (options && options.scrollerType) {
          modernScroller = new options.scrollerType(container, options);
        } else {
          if (dorado.Browser.isTouch || $setting["common.simulateTouch"]) {
            modernScroller = new dorado.util.Dom.IScrollerWrapper(container, options);
          } else {
            modernScroller = new dorado.util.Dom.DesktopModernScroller(container, options);
          }
        }
      }
      if (modernScroller) {
        $container.data("modernScroller", modernScroller);
      }
    }
    catch (e) {
      dorado.Exception.processException(e);
    }
    return modernScroller;
  };
  dorado.util.Dom.destroyModernScroll = function(container: any, options: any) {
    let modernScroller = $(container).data("modernScroller");
    if (modernScroller) {
      modernScroller.destroy();
    }
  };
})(jQuery);
(function() {
  dorado.SocketProtocol = $class({$className:"dorado.SocketProtocol"});
  dorado.LongPollingProtocol = $extend(dorado.SocketProtocol, {$className:"dorado.LongPollingProtocol", serviceAction:"long-polling", constructor:function() {
      this._sockets = new dorado.util.KeyedArray(function(socket: any) {
        return socket._socketId;
      });
      this._socketIds = [];
      this._pollingOptions = $setting["longPolling.pollingOptions"];
      this._sendingOptions = $setting["longPolling.sendingOptions"];
    }, connect:function(socket: any, callback: any) {
      let self = this;
      if (!self._pollingAjaxEngine || !self._sendingAjaxEngine) {
        self._pollingAjaxEngine = dorado.util.AjaxEngine.getInstance(self._pollingOptions);
        self._sendingAjaxEngine = dorado.util.AjaxEngine.getInstance(self._sendingOptions);
      }
      socket._setState("connecting");
      if (self._connecting && !self._groupId) {
        if (!self._pendingConnects) {
          self._pendingConnects = [];
        }
        self._pendingConnects.push({socket:socket, callback:callback});
      } else {
        self.doConnection(socket, callback);
      }
    }, doConnection:function(socket: any, callback: any) {
      let self = this;
      self._sendingAjaxEngine.bind("beforeConnect", function() {
        self._connecting = true;
      }, {once:true}).bind("onDisconnect", function() {
        self._connecting = false;
        if (self._polling) {
          self.stopPoll();
        }
        if (self._pendingConnects) {
          let pendingConnects = self._pendingConnects;
          delete self._pendingConnects;
          pendingConnects.each(function(c: any) {
            self.doConnection(c.socket, c.callback);
          });
        }
      }, {once:true});
      self._sendingAjaxEngine.request({jsonData:{action:self.serviceAction, subAction:"hand-shake", groupId:self._groupId, service:socket._service, parameter:socket._parameter, responseDelay:((socket._responseDelay >= 0) ? socket._responseDelay : -1)}}, {callback:function(success: any, result: any) {
          if (success) {
            let data = result.getJsonData();
            self._groupId = data.groupId;
            socket._connected(data.socketId);
            self._sockets.append(socket);
            self._socketIds.push(socket._socketId);
            if (!self._polling) {
              self._pollingErrorTimes = 0;
              self.poll();
            }
            $callback(callback, success, data.returnValue);
          } else {
            $callback(callback, success, result.exception);
          }
        }});
    }, disconnect:function(socket: any, callback: any) {
      let self = this;
      socket._setState("disconnecting");
      self._sockets.remove(socket);
      self._socketIds.remove(socket._socketId);
      self._sendingAjaxEngine.request({jsonData:{action:self.serviceAction, subAction:"disconnect", socketId:socket._socketId}}, {callback:function(success: any, result: any) {
          if (success) {
            socket._disconnected();
          }
          $callback(callback, success, result);
        }});
    }, destroy:function() {
      this._sockets.each(function(socket: any) {
        socket._disconnected();
      });
    }, poll:function(callback: any) {
      let self = this;
      if (!self._groupId) {
        throw new dorado.Exception("Polling groupId undefined.");
      }
      self._polling = true;
      self._pollingAjaxEngine.request({jsonData:{action:self.serviceAction, subAction:"poll", groupId:self._groupId, socketIds:self._socketIds}}, {callback:function(success: any, result: any) {
          if (!success) {
            self._pollingErrorTimes++;
          }
          if (self._pollingErrorTimes < 5 && self._sockets.size) {
            self.poll(callback);
          } else {
            self._polling = false;
          }
          if (!success && result.exception instanceof dorado.util.AjaxException && result.status === 0) {
            dorado.Exception.removeException(result.exception);
          }
          if (success && result) {
            let messages = result.getJsonData();
            messages.each(function(wrapper: any) {
              let socket = self._sockets.get(wrapper.socketId);
              if (socket && socket._state === "connected") {
                try {
                  let message = wrapper.message;
                  if (message.type === "$terminate") {
                    socket._disconnected();
                    return;
                  }
                  socket._received(message.type, message.data);
                }
                catch (e) {
                  dorado.Exception.processException(e);
                }
              }
            });
          }
          $callback(callback, success, result);
        }});
    }, stopPoll:function(callback: any) {
      let self = this;
      if (!self._groupId) {
        throw new dorado.Exception("Polling groupId undefined.");
      }
      self._sendingAjaxEngine.request({jsonData:{action:self.serviceAction, subAction:"stop-poll", groupId:self._groupId}}, {callback:function(success: any, result: any) {
          if (success) {
            $callback(callback, success, result.getJsonData());
          } else {
            $callback(callback, success, result.exception);
          }
        }});
    }, send:function(socket: any, type: any, data: any, callback: any) {
      let self = this;
      self._sendingAjaxEngine.request({jsonData:{action:self.serviceAction, subAction:"send", socketId:socket._socketId, type:type, data:data}}, {callback:function(success: any, result: any) {
          if (success) {
            $callback(callback, success, result.getJsonData());
          } else {
            $callback(callback, success, result.exception);
          }
        }});
    }});
  dorado.Socket = $extend([dorado.AttributeSupport, dorado.EventSupport], {$className:"dorado.Socket", ATTRIBUTES:{service:{}, parameter:{}, protocol:{readOnly:true}, state:{readOnly:true, defaultValue:"disconnected"}, connected:{readOnly:true, getter:function() {
          return this._state === "connected";
        }}}, EVENTS:{onConnect:{}, onDisconnect:{}, onStateChange:{}, onReceive:{}, onSend:{}}, constructor:function(options: any) {
      this._protocol = this.getSocketProtocol();
      $invokeSuper.call(this, [options]);
      if (options) {
        this.set(options);
      }
    }, _setState:function(state: any) {
      if (this._state !== state) {
        let oldState = this._state;
        this._state = state;
        this.fireEvent("onStateChange", this, {oldState:oldState, state:state});
      }
    }, _received:function(type: any, data: any) {
      let socket = this;
      socket.fireEvent("onReceive", socket, {type:type, data:data});
    }, connect:function(callback: any) {
      let socket = this;
      if (socket._state !== "disconnected") {
        throw new dorado.Exception("Illegal socket state.");
      }
      socket._protocol.connect(socket, callback);
    }, _connected:function(socketId: any) {
      let socket = this;
      socket._socketId = socketId;
      socket._setState("connected");
      socket.fireEvent("onConnect", socket);
    }, disconnect:function(callback: any) {
      let socket = this;
      if (socket._state !== "connected") {
        throw new dorado.Exception("Not connected yet.");
      }
      socket._protocol.disconnect(socket, callback);
    }, _disconnected:function() {
      let socket = this;
      socket._setState("disconnected");
      socket.fireEvent("onDisconnect", socket);
      delete socket._socketId;
    }, send:function(type: any, data: any, callback: any) {
      let socket = this;
      if (socket._state !== "connected") {
        throw new dorado.Exception("Not connected yet.");
      }
      socket._protocol.send(socket, type, data, {callback:function(success: any, packet: any) {
          if (success) {
            socket.fireEvent("onSend", socket, {type:type, data:data});
          }
          $callback(callback, success, packet);
        }});
    }});
  let defaultSocketProtocol;
  dorado.LongPollingSocket = $extend(dorado.Socket, {ATTRIBUTES:{responseDelay:{defaultValue:-1}}, getSocketProtocol:function() {
      if (!defaultSocketProtocol) {
        defaultSocketProtocol = new dorado.LongPollingProtocol();
      }
      return defaultSocketProtocol;
    }});
  dorado.Socket.connect = function(options: any, callback: any) {
    let socket = new dorado.LongPollingSocket(options);
    socket.connect(callback);
    return socket;
  };
  jQuery(window).on("unload",function() {
    if (defaultSocketProtocol) {
      defaultSocketProtocol.destroy();
    }
  });
})();
