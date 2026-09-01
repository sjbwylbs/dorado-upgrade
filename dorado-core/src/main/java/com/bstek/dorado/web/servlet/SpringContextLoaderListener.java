package com.bstek.dorado.web.servlet;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.web.context.ConfigurableWebApplicationContext;
import org.springframework.web.context.ContextLoaderListener;

import com.bstek.dorado.web.listener.DelegatingServletContextListenersManager;
import com.bstek.dorado.web.listener.DelegatingSessionListenersManager;
import com.bstek.dorado.web.loader.DoradoLoader;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

public class SpringContextLoaderListener extends ContextLoaderListener implements HttpSessionListener {

	private static final Log logger = LogFactory.getLog(SpringContextLoaderListener.class);

	private DoradoLoader doradoLoader;

	public SpringContextLoaderListener() {
		doradoLoader = DoradoLoader.getInstance();
	}

	@Override
	protected void customizeContext(ServletContext servletContext,
			ConfigurableWebApplicationContext applicationContext) {
		try {
			if (!doradoLoader.isPreloaded()) {
				doradoLoader.preload(servletContext, true);
			}

			List<String> doradoContextLocations = doradoLoader.getContextLocations(false);
			List<String> xmlLocations = new ArrayList<>();
			List<String> javaConfigClasses = new ArrayList<>();

			for (String location : doradoContextLocations) {
				if (isJavaConfigClass(location)) {
					javaConfigClasses.add(location);
				}
				else {
					xmlLocations.add(location);
				}
			}

			// Set XML config locations
			if (!xmlLocations.isEmpty()) {
				String[] realResourcesPath = doradoLoader.getRealResourcesPath(xmlLocations);
				applicationContext.setConfigLocations(realResourcesPath);
			}

			// Register Java @Configuration classes
			if (!javaConfigClasses.isEmpty() && applicationContext instanceof BeanDefinitionRegistry) {
				BeanDefinitionRegistry registry = (BeanDefinitionRegistry) applicationContext;
				for (String className : javaConfigClasses) {
					try {
						Class<?> configClass = Class.forName(className);
						if (!registry.containsBeanDefinition(className)) {
							RootBeanDefinition bd = new RootBeanDefinition(configClass);
							bd.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
							registry.registerBeanDefinition(className, bd);
						}
					}
					catch (ClassNotFoundException e) {
						logger.warn("Java config class not found: " + className);
					}
				}
			}
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

	private static boolean isJavaConfigClass(String location) {
		if (location.startsWith("classpath:") || location.startsWith("file:") || location.endsWith(".xml")) {
			return false;
		}
		if (location.contains("/") || location.contains("*") || location.contains("?")) {
			return false;
		}
		try {
			Class.forName(location.trim());
			return true;
		}
		catch (ClassNotFoundException e) {
			return false;
		}
	}

	@Override
	public void contextInitialized(ServletContextEvent event) {
		try {
			DelegatingServletContextListenersManager.fireContextInitialized(event);
		}
		catch (Exception e) {
			logger.error(e, e);
		}

		super.contextInitialized(event);
	}

	@Override
	public void contextDestroyed(ServletContextEvent event) {
		super.contextDestroyed(event);

		try {
			DelegatingServletContextListenersManager.fireContextDestroyed(event);
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

	@Override
	public void sessionCreated(HttpSessionEvent event) {
		try {
			DelegatingSessionListenersManager.fireSessionCreated(event);
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		try {
			DelegatingSessionListenersManager.fireSessionDestroyed(event);
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

}
