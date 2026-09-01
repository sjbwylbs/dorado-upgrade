package com.bstek.dorado.core;

import java.io.IOException;

import com.bstek.dorado.core.io.Resource;
import com.bstek.dorado.core.io.ResourceLoader;

/**
 * 实现了上下文属性的维护和资源读取功能的上下文抽象支持类。
 *
 * @see com.bstek.dorado.core.io.Resource
 * @see com.bstek.dorado.core.io.ResourceLoader
 */
public abstract class ContextSupport extends Context {

	protected abstract ResourceLoader getResourceLoader();

	@Override
	public Resource getResource(String resourceLocation) {
		return getResourceLoader().getResource(resourceLocation);
	}

	@Override
	public Resource[] getResources(String locationPattern) throws IOException {
		return getResourceLoader().getResources(locationPattern);
	}

	@Override
	public ClassLoader getClassLoader() {
		return getResourceLoader().getClassLoader();
	}

}
