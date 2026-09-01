declare const dorado: any;
declare const $setting: any;
declare const $resource: any;
declare const $DomUtils: any;
declare const $fly: any;
declare const $import: any;
declare const $load: any;
declare const $packagesConfig: any;
declare const $: any;
declare const jQuery: any;

// Dorado framework custom global functions
declare const $invokeSuper: any;
declare const $extend: any;
declare const $class: any;
declare const $singleton: any;
declare const $scopify: any;
declare const $setTimeout: any;
declare const $callback: any;
declare const $url: any;
declare const $waitFor: any;
declare const $getSuperClass: any;
declare const $topView: any;

// Dorado framework custom global objects
declare const valueComparators: any;

// Allow any properties on window (for dynamically set properties)
interface Window {
    [key: string]: any;
    dorado: any;
    $packagesConfig: any;
}

// Extend HTMLElement to allow any custom properties (used by dorado)
interface HTMLElement {
    [key: string]: any;
}

// Extend Element to allow any custom properties
interface Element {
    [key: string]: any;
}

// Extend Array prototype to allow dorado custom methods
interface Array<T> {
    remove(item: T): number;
    removeAt(index: number): void;
    insert(item: T, index?: number): void;
    peek(): T;
    each(fn: (item: T, index: number) => boolean | void): void;
    [key: string]: any;
}

// Extend Function prototype
interface Function {
    bind(target: any, ...args: any[]): any;
}

// jQuery custom extensions used by dorado
interface JQuery {
    edgeLeft(arg?: any): any;
    edgeTop(arg?: any): any;
    addClassOnHover(arg?: any): any;
    effect(arg?: any, ...rest: any[]): any;
    padding(arg?: any): any;
    textarea(arg?: any): any;
    mousewheel(arg?: any): any;
    hotkeys(arg?: any): any;
    easing(arg?: any): any;
    textDom?: any;
    _lazyRender?: any;
    _touchmove?: any;
    [key: string]: any;
}
