package com.bstek.dorado.view.resolver;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.apache.velocity.runtime.resource.Resource;
import org.apache.velocity.runtime.resource.loader.ResourceLoader;
import org.apache.velocity.util.ExtProperties;

import com.bstek.dorado.core.Context;

/**
 * 用于桥接dorado的资源装载器的Velocity资源装载器。
 *
 */
public class VelocityViewTemplateResourceLoader extends ResourceLoader {

	private static final Log logger = LogFactory.getLog(VelocityViewTemplateResourceLoader.class);

	protected com.bstek.dorado.core.io.Resource getDoradoResource(String path) {
		Context context = Context.getCurrent();
		return context.getResource(path);
	}

	@Override
	public void init(ExtProperties properties) {
	}

	@Override
	public boolean isSourceModified(Resource resource) {
		com.bstek.dorado.core.io.Resource r = getDoradoResource(resource.getName());
		try {
			return (r.getTimestamp() != resource.getLastModified());
		}
		catch (IOException e) {
			logger.error(e, e);
			return false;
		}
	}

	@Override
	public long getLastModified(Resource resource) {
		com.bstek.dorado.core.io.Resource r = getDoradoResource(resource.getName());
		try {
			return r.getTimestamp();
		}
		catch (IOException e) {
			logger.error(e, e);
			return 0;
		}
	}

	public InputStream getResourceStream(String path) throws ResourceNotFoundException {
		com.bstek.dorado.core.io.Resource resource = getDoradoResource(path);
		if (!resource.exists()) {
			throw new ResourceNotFoundException(path);
		}
		try {
			return resource.getInputStream();
		}
		catch (IOException e) {
			logger.error(e, e);
			return null;
		}
	}

	@Override
	public java.io.Reader getResourceReader(String path, String encoding) throws ResourceNotFoundException {
		com.bstek.dorado.core.io.Resource resource = getDoradoResource(path);
		if (!resource.exists()) {
			throw new ResourceNotFoundException(path);
		}
		try {
			return new java.io.InputStreamReader(resource.getInputStream(), encoding);
		}
		catch (IOException e) {
			logger.error(e, e);
			return null;
		}
	}

}
