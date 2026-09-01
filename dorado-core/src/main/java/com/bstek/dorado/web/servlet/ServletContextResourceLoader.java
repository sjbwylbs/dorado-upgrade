package com.bstek.dorado.web.servlet;

import java.io.IOException;
import java.lang.reflect.Constructor;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.ResourceLoader;

import com.bstek.dorado.core.io.BaseResourceLoader;
import com.bstek.dorado.core.io.InputStreamResource;
import com.bstek.dorado.core.io.Resource;
import com.bstek.dorado.util.clazz.ClassUtils;
import com.bstek.dorado.web.ConsoleUtils;

import jakarta.servlet.ServletContext;

public class ServletContextResourceLoader extends BaseResourceLoader {

	private static final Log logger = LogFactory.getLog(ServletContextResourceLoader.class);

	private ServletContext servletContext;

	private ResourceLoader resourceLoader;

	public ServletContextResourceLoader(ServletContext servletContext) {
		this.servletContext = servletContext;
		String resourceLoaderClass = servletContext.getInitParameter("resourceLoaderClass");
		if (StringUtils.isNotEmpty(StringUtils.trim(resourceLoaderClass))) {
			ConsoleUtils.outputLoadingInfo("[resourceLoaderClass=" + resourceLoaderClass + "]");

			try {
				@SuppressWarnings("unchecked")
				Class<ResourceLoader> type = ClassUtils.forName(resourceLoaderClass);
				Constructor<ResourceLoader> constr = type.getConstructor(new Class[] { ClassLoader.class });
				resourceLoader = constr.newInstance(new Object[] { getClass().getClassLoader() });
			}
			catch (Exception e) {
				logger.error(e, e);
			}
		}
	}

	@Override
	protected ResourceLoader getAdaptee() {
		if (resourceLoader != null) {
			return resourceLoader;
		}
		else {
			return super.getAdaptee();
		}
	}

	@Override
	public Resource getResource(String resourceLocation) {
		if (resourceLocation.startsWith("/")) {
			return new InputStreamResource(servletContext.getResourceAsStream(resourceLocation));
		}
		else {
			return super.getResource(resourceLocation);
		}
	}

	@Override
	public Resource[] getResources(String locationPattern) throws IOException {
		throw new UnsupportedOperationException();
	}

}
