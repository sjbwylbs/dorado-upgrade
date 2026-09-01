package com.bstek.dorado.core;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.BeanDefinitionStoreException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.context.support.GenericXmlApplicationContext;

import com.bstek.dorado.core.io.DefaultResource;
import com.bstek.dorado.core.io.Resource;

public abstract class SpringApplicationContext extends SpringContextSupport {

	private static final String CONFIG_PROPERTY = "core.contextConfigLocation";

	private static final String EXT_CONFIG_PROPERTY = "core.extensionContextConfigLocation";

	private static final String LOCATION_SEPARATOR = ",;";

	private static ApplicationContext applicationContext;

	private static Log logger = LogFactory.getLog(SpringApplicationContext.class);

	private Resource[] getConfigLocations(String configLocation) throws IOException {
		Set<Resource> resourceSet = new LinkedHashSet<>();

		String[] configLocations = StringUtils.split(configLocation, LOCATION_SEPARATOR);
		for (String location : configLocations) {
			if (StringUtils.isNotBlank(location) && !isJavaConfigClass(location)) {
				CollectionUtils.addAll(resourceSet, getResources(location));
			}
		}

		for (Iterator<Resource> it = resourceSet.iterator(); it.hasNext();) {
			Resource resource = it.next();
			if (!resource.exists()) {
				logger.warn("Resource [" + resource + "] does not exist.");
				it.remove();
			}
		}

		Resource[] resources = new Resource[resourceSet.size()];
		resourceSet.toArray(resources);
		return resources;
	}

	private List<String> getJavaConfigClasses(String configLocation) {
		List<String> classNames = new ArrayList<>();
		String[] configLocations = StringUtils.split(configLocation, LOCATION_SEPARATOR);
		for (String location : configLocations) {
			if (StringUtils.isNotBlank(location) && isJavaConfigClass(location)) {
				classNames.add(location.trim());
			}
		}
		return classNames;
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

	private void registerJavaConfigClasses(GenericApplicationContext ctx, List<String> classNames) {
		for (String className : classNames) {
			try {
				Class<?> configClass = Class.forName(className);
				if (!ctx.containsBeanDefinition(className)) {
					RootBeanDefinition bd = new RootBeanDefinition(configClass);
					bd.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
					ctx.registerBeanDefinition(className, bd);
				}
			}
			catch (ClassNotFoundException e) {
				logger.warn("Java config class not found: " + className);
			}
		}
	}

	private void loadBeanDefintiionsFromResource(XmlBeanDefinitionReader xmlReader, Resource resource)
			throws BeanDefinitionStoreException, IOException {
		if (resource instanceof DefaultResource) {
			xmlReader.loadBeanDefinitions(((DefaultResource) resource).getAdaptee());
		}
		else {
			xmlReader.loadBeanDefinitions(resource.getPath());
		}
	}

	protected GenericApplicationContext internalCreateApplicationContext() {
		return new GenericXmlApplicationContext();
	}

	/**
	 * 初始化Dorado Engine内部使用的ApplicationContext。
	 * @throws Exception
	 */
	public void initApplicationContext() throws Exception {
		getApplicationContext();
	}

	/**
	 * 返回Dorado Engine内部使用的ApplicationContext。
	 * @throws Exception
	 */
	@Override
	public ApplicationContext getApplicationContext() throws Exception {
		if (applicationContext == null) {
			GenericApplicationContext ctx = internalCreateApplicationContext();
			applicationContext = ctx;

			XmlBeanDefinitionReader xmlReader = new XmlBeanDefinitionReader(ctx);

			String configLocation = Configure.getString(CONFIG_PROPERTY);
			if (StringUtils.isBlank(configLocation)) {
				throw new IllegalArgumentException("[" + CONFIG_PROPERTY + "] undefined.");
			}

			// Load XML resources
			for (Resource resource : getConfigLocations(configLocation)) {
				loadBeanDefintiionsFromResource(xmlReader, resource);
			}
			// Register Java @Configuration classes
			registerJavaConfigClasses(ctx, getJavaConfigClasses(configLocation));

			String extConfigLocation = Configure.getString(EXT_CONFIG_PROPERTY);
			if (!StringUtils.isBlank(extConfigLocation)) {
				for (Resource resource : getConfigLocations(extConfigLocation)) {
					loadBeanDefintiionsFromResource(xmlReader, resource);
				}
				registerJavaConfigClasses(ctx, getJavaConfigClasses(extConfigLocation));
			}

			ctx.refresh();
		}
		return applicationContext;
	}

}
