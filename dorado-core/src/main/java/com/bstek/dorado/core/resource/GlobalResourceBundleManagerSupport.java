package com.bstek.dorado.core.resource;

import java.util.Locale;

import org.apache.commons.collections4.keyvalue.MultiKey;
import org.springframework.cache.Cache;
import org.springframework.cache.Cache.ValueWrapper;

public abstract class GlobalResourceBundleManagerSupport implements GlobalResourceBundleManager {

	private Cache cache;

	public void setCache(Cache cache) {
		this.cache = cache;
	}

	protected abstract ResourceBundle doGetBundle(String bundleName, Locale locale) throws Exception;

	@Override
	public ResourceBundle getBundle(String bundleName, Locale locale) throws Exception {
		Object cacheKey = new MultiKey<>(bundleName, locale);
		synchronized (cache) {
			ValueWrapper wrapper = cache.get(cacheKey);
			if (wrapper == null) {
				ResourceBundle bundle = doGetBundle(bundleName, locale);
				cache.put(cacheKey, bundle);
				return bundle;
			}
			return (ResourceBundle) wrapper.get();
		}
	}

}
