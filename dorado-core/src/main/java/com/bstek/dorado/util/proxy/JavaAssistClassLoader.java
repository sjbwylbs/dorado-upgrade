package com.bstek.dorado.util.proxy;

import javassist.util.proxy.ProxyFactory;

public class JavaAssistClassLoader {

	public static ProxyFactory.ClassLoaderProvider createJavaAssistClassLoader() {
		ProxyFactory.classLoaderProvider = new ProxyFactory.ClassLoaderProvider() {
			@Override
			public ClassLoader get(ProxyFactory pf) {
				return Thread.currentThread().getContextClassLoader();
			}
		};
		return ProxyFactory.classLoaderProvider;
	}

}
