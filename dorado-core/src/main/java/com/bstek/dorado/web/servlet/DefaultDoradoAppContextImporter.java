package com.bstek.dorado.web.servlet;

import java.util.List;
import java.util.Objects;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.beans.factory.xml.ParserContext;
import org.springframework.beans.factory.xml.XmlReaderContext;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.w3c.dom.Element;

import com.bstek.dorado.spring.DoradoAppContextImporter;
import com.bstek.dorado.web.ConsoleUtils;
import com.bstek.dorado.web.loader.DoradoLoader;

public class DefaultDoradoAppContextImporter implements DoradoAppContextImporter {

	private static final Log logger = LogFactory.getLog(DefaultDoradoAppContextImporter.class);

	protected void importBeanDefinitionResource(String location, Element element, ParserContext parserContext)
			throws Exception {
		XmlReaderContext readerContext = parserContext.getReaderContext();
		try {
			if (location.endsWith(".xml")) {
				// XML configuration - use existing XML reader
				ResourceLoader resourceLoader = readerContext.getResourceLoader();
				Resource relativeResource = resourceLoader.getResource(location);

				int importCount = readerContext.getReader().loadBeanDefinitions(relativeResource);
				if (logger.isDebugEnabled()) {
					logger.debug("Imported " + importCount + " bean definitions from dorado-context [" + location + "]");
				}
			}
			else {
				// Java @Configuration class - register as bean definition
				importJavaConfiguration(location.trim(), element, parserContext);
			}
		}
		catch (Exception ex) {
			readerContext.error("Invalid dorado-context [" + location + "] to import bean definitions from", element,
					null, ex);
		}

		readerContext.fireImportProcessed(location, readerContext.extractSource(element));
	}

	/**
	 * Registers a Java @Configuration class as a bean definition in the Spring registry.
	 * The ConfigurationClassPostProcessor will process it during context refresh.
	 */
	protected void importJavaConfiguration(String className, Element element, ParserContext parserContext)
			throws Exception {
		BeanDefinitionRegistry registry = parserContext.getRegistry();
		try {
			Class<?> configClass = Class.forName(className);
			String beanName = className;
			if (!registry.containsBeanDefinition(beanName)) {
				RootBeanDefinition bd = new RootBeanDefinition(configClass);
				bd.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
				registry.registerBeanDefinition(beanName, bd);
				if (logger.isDebugEnabled()) {
					logger.debug("Registered Java @Configuration [" + className + "]");
				}
			}
		}
		catch (ClassNotFoundException ex) {
			XmlReaderContext readerContext = parserContext.getReaderContext();
			readerContext.error("Java configuration class not found [" + className + "]", element, null, ex);
		}
	}

	@Override
	public void importDoradoAppContext(Element element, ParserContext parserContext) throws Exception {
		DoradoLoader doradoLoader = DoradoLoader.getInstance();
		if (!doradoLoader.isPreloaded()) {
			doradoLoader.preload(null, false);
		}

		List<String> doradoContextLocations = doradoLoader.getContextLocations(false);
		Objects.requireNonNull(
				"Can not get [doradoContextLocations], the DoradoPreloadListener may not configured or configured in wrong order. "
						+ "Please check your web.xml.");

		ConsoleUtils.outputLoadingInfo("Loading dorado context configures...");

		for (String location : doradoContextLocations) {
			importBeanDefinitionResource(location, element, parserContext);
		}
	}

}
