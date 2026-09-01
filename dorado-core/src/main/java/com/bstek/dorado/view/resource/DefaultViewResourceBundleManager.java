package com.bstek.dorado.view.resource;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.Properties;

import org.apache.commons.collections4.keyvalue.MultiKey;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.Cache;

import com.bstek.dorado.core.io.Resource;
import com.bstek.dorado.core.resource.DefaultResourceBundle;
import com.bstek.dorado.core.resource.ResourceBundle;
import com.bstek.dorado.util.PathUtils;
import com.bstek.dorado.view.config.definition.ViewConfigDefinition;

public class DefaultViewResourceBundleManager implements ViewResourceBundleManager {

	private static final String RESOURCE_FILE_SUFFIX = ".properties";

	private Cache cache;

	public void setCache(Cache cache) {
		this.cache = cache;
	}

	protected Resource findResource(ViewConfigDefinition viewConfigDefinition, Locale locale) throws IOException {
		Resource viewResource = viewConfigDefinition.getResource();
		if (viewResource != null) {
			Resource resource;
			String path = viewResource.getPath();
			if (StringUtils.isEmpty(path)) {
				return null;
			}

			int i = path.lastIndexOf(PathUtils.PATH_DELIM);
			if (i >= 0) {
				path = path.substring(i + 1);
			}
			else {
				i = path.lastIndexOf(':');
				if (i >= 0) {
					path = path.substring(i + 1);
				}
			}
			i = path.indexOf('.');
			if (i >= 0) {
				path = path.substring(0, i);
			}

			if (locale != null) {
				String localeSuffix = '.' + locale.toString();
				try {
					resource = viewResource.createRelative(path + localeSuffix + RESOURCE_FILE_SUFFIX);
					if (resource != null && resource.exists()) {
						return resource;
					}
				}
				catch (Exception e) {
					// JBOSS 5.1下安装snowdrop后的VFS在找不到子资源时会抛出异常
				}
			}

			try {
				resource = viewResource.createRelative(path + RESOURCE_FILE_SUFFIX);
				if (resource != null && resource.exists()) {
					return resource;
				}
			}
			catch (Exception e) {
				// JBOSS 5.1下安装snowdrop后的VFS在找不到子资源时会抛出异常
			}
		}
		return null;
	}

	public ResourceBundle doGetBundle(ViewConfigDefinition viewConfigDefinition, Locale locale) throws Exception {
		Resource resource = findResource(viewConfigDefinition, locale);
		if (resource != null) {
			InputStream in = resource.getInputStream();
			try {
				Properties properties = new Properties();
				properties.load(in);
				return new DefaultResourceBundle(properties);
			}
			finally {
				in.close();
			}
		}
		return null;
	}

	@Override
	public ResourceBundle getBundle(ViewConfigDefinition viewConfigDefinition, Locale locale) throws Exception {
		Resource resource = viewConfigDefinition.getResource();
		if (resource == null) {
			return null;
		}
		String path = resource.getPath();
		if (StringUtils.isEmpty(path)) {
			return null;
		}

		Object cacheKey = new MultiKey<>(path, locale);
		synchronized (cache) {
			Cache.ValueWrapper wrapper = cache.get(cacheKey);
			if (wrapper == null) {
				ResourceBundle bundle = doGetBundle(viewConfigDefinition, locale);
				cache.put(cacheKey, bundle);
				return bundle;
			}
			return (ResourceBundle) wrapper.get();
		}
	}

}
