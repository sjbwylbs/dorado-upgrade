package com.bstek.dorado.data.resource;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.Properties;

import org.apache.commons.collections4.keyvalue.MultiKey;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.Cache;

import com.bstek.dorado.config.definition.Definition;
import com.bstek.dorado.core.io.Resource;
import com.bstek.dorado.core.resource.ResourceBundle;
import com.bstek.dorado.util.PathUtils;

public class DefaultModelResourceBundleManager implements ModelResourceBundleManager {

	private static final String RESOURCE_FILE_SUFFIX = ".properties";

	private Cache cache;

	public void setCache(Cache cache) {
		this.cache = cache;
	}

	protected Resource findResource(Resource modelResource, Locale locale) throws IOException {
		if (modelResource != null) {
			Resource resource;
			String path = modelResource.getPath();
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
					resource = modelResource.createRelative(path + localeSuffix + RESOURCE_FILE_SUFFIX);
					if (resource != null && resource.exists()) {
						return resource;
					}
				}
				catch (Exception e) {
					// JBOSS 5.1下安装snowdrop后的VFS在找不到子资源时会抛出异常
				}
			}

			try {
				resource = modelResource.createRelative(path + RESOURCE_FILE_SUFFIX);
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

	protected ResourceBundle doGetBundle(Resource modelResource, Locale locale) throws Exception {
		Resource resource = findResource(modelResource, locale);
		if (resource != null) {
			InputStream in = resource.getInputStream();
			try {
				Properties properties = new Properties();
				properties.load(in);
				return new ModelResourceBundle(properties);
			}
			finally {
				in.close();
			}
		}
		return null;
	}

	@Override
	public ResourceBundle getBundle(Resource resource, Locale locale) throws Exception {
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
				ResourceBundle bundle = doGetBundle(resource, locale);
				cache.put(cacheKey, bundle);
				return bundle;
			}
			return (ResourceBundle) wrapper.get();
		}
	}

	@Override
	public ResourceBundle getBundle(Definition definition, Locale locale) throws Exception {
		return getBundle(definition.getResource(), locale);
	}

}
