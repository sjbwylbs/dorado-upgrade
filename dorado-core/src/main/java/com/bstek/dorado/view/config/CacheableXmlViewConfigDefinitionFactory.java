package com.bstek.dorado.view.config;

import java.io.IOException;
import java.io.Serializable;

import org.springframework.cache.Cache;
import org.springframework.cache.Cache.ValueWrapper;

import com.bstek.dorado.core.io.DefaultRefreshableResource;
import com.bstek.dorado.core.io.RefreshableResource;
import com.bstek.dorado.core.io.Resource;
import com.bstek.dorado.view.config.definition.ViewConfigDefinition;

public class CacheableXmlViewConfigDefinitionFactory extends XmlViewConfigDefinitionFactory {

	private static class DefinitionCacheElement implements Serializable {

		private static final long serialVersionUID = 2242361888668510593L;

		private Object cacheKey;
		private ViewConfigDefinition definition;
		private RefreshableResource refreshableResource;

		public DefinitionCacheElement(Object cacheKey, ViewConfigDefinition defintion) throws IOException {
			this.cacheKey = cacheKey;
			this.definition = defintion;

			Resource resource = defintion.getResource();
			if (resource != null) {
				if (resource instanceof RefreshableResource) {
					refreshableResource = (RefreshableResource) resource;
				}
				else {
					refreshableResource = new DefaultRefreshableResource(resource);
				}
			}
		}

		public ViewConfigDefinition getDefinition() {
			return definition;
		}

		public boolean isExpired() {
			if (refreshableResource != null) {
				return !refreshableResource.isValid();
			}
			else {
				return false;
			}
		}

	}

	private Cache cache;

	public void setCache(Cache cache) {
		this.cache = cache;
	}

	@Override
	protected ViewConfigDefinition doCreate(String viewName) throws Exception {
		ViewConfigDefinition definition;
		Object definitionCacheKey = getDefinitionCacheKey(viewName);
		ValueWrapper wrapper;
		synchronized (cache) {
			wrapper = cache.get(definitionCacheKey);
		}
		if (wrapper != null) {
			Object val = wrapper.get();
			if (val instanceof DefinitionCacheElement) {
				DefinitionCacheElement dce = (DefinitionCacheElement) val;
				if (!dce.isExpired()) {
					definition = dce.getDefinition();
				}
				else {
					cache.evict(definitionCacheKey);
					definition = super.doCreate(viewName);
					DefinitionCacheElement newDce = new DefinitionCacheElement(definitionCacheKey, definition);
					synchronized (cache) {
						cache.put(definitionCacheKey, newDce);
					}
				}
			}
			else {
				definition = (ViewConfigDefinition) val;
			}
		}
		else {
			definition = super.doCreate(viewName);
			DefinitionCacheElement dce = new DefinitionCacheElement(definitionCacheKey, definition);
			synchronized (cache) {
				cache.put(definitionCacheKey, dce);
			}
		}
		return definition;
	}

	protected Object getDefinitionCacheKey(String viewName) throws Exception {
		return viewName;
	}

}
