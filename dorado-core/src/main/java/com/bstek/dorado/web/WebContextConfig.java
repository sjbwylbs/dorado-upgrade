package com.bstek.dorado.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.core.bean.BeanFactoryRegister;
import com.bstek.dorado.core.bean.DefaultBeanFactoryRegistry;
import com.bstek.dorado.core.el.ContextVarsInitializerRegister;
import com.bstek.dorado.core.xml.XercesXmlDocumentBuilder;
import com.bstek.dorado.web.loader.ConsoleStartedMessagesOutputter;
import com.bstek.dorado.web.loader.DoradoApplicationEventMulticaster;
import com.bstek.dorado.web.loader.RunModeConsoleStartedMessageOutputter;
import com.bstek.dorado.web.resolver.JVMCacheBusterGenerator;
import com.bstek.dorado.web.resolver.ResourceTypeLoader;
import com.bstek.dorado.web.resolver.ResourceTypeManager;
import com.bstek.dorado.web.resolver.ResourceTypeParser;
import com.bstek.dorado.web.resolver.SpringBeanControllerResolver;

@Configuration
public class WebContextConfig {

	@Bean("dorado.scopeManager")
	public WebScopeManager scopeManager() {
		return new WebScopeManager();
	}

	@Bean("dorado.webBeanFactoryRegister")
	public BeanFactoryRegister webBeanFactoryRegister(
			@Qualifier("dorado.beanFactoryRegistry") DefaultBeanFactoryRegistry beanFactoryRegistry) {
		BeanFactoryRegister bean = new BeanFactoryRegister();
		bean.setBeanFactoryRegistry(beanFactoryRegistry);
		bean.setBeanFactories(List.of(new WebSpringBeanFactory()));
		return bean;
	}

	@Bean("dorado.controllerResolver")
	public SpringBeanControllerResolver controllerResolver() {
		return new SpringBeanControllerResolver();
	}

	@Bean("dorado.cacheBusterGenerator")
	public JVMCacheBusterGenerator cacheBusterGenerator() {
		return new JVMCacheBusterGenerator();
	}

	@Bean("dorado.resourceTypeManager")
	public ResourceTypeManager resourceTypeManager() {
		return new ResourceTypeManager();
	}

	/**
	 * Abstract bean definition helper for dorado.resourceTypeLoader.
	 */
	protected ResourceTypeLoader resourceTypeLoader(
			ResourceTypeManager resourceTypeManager,
			XercesXmlDocumentBuilder xmlDocumentBuilder) {
		ResourceTypeLoader bean = new ResourceTypeLoader();
		bean.setResourceTypeManager(resourceTypeManager);
		bean.setXmlDocumentBuilder(xmlDocumentBuilder);
		bean.setResourceTypeParser(new ResourceTypeParser());
		return bean;
	}

	@Bean("dorado.webResourceTypeLoader")
	public ResourceTypeLoader webResourceTypeLoader(
			ResourceTypeManager resourceTypeManager,
			XercesXmlDocumentBuilder xmlDocumentBuilder) {
		ResourceTypeLoader bean = resourceTypeLoader(resourceTypeManager, xmlDocumentBuilder);
		bean.setConfigLocations(List.of(
				"com/bstek/dorado/web/resolver/resource-types.xml",
				"home:resource-types.xml"));
		return bean;
	}

	@Bean("dorado.webExpressionVarsInitializerRegister")
	public ContextVarsInitializerRegister webExpressionVarsInitializerRegister() {
		ContextVarsInitializerRegister bean = new ContextVarsInitializerRegister();
		bean.setContextInitializer(new WebContextVarsInitializer());
		return bean;
	}

	@Bean("dorado.consoleStartedMessagesOutputter")
	public ConsoleStartedMessagesOutputter consoleStartedMessagesOutputter() {
		return new ConsoleStartedMessagesOutputter();
	}

	@Bean("dorado.runModeConsoleStartedMessageOutputter")
	public RunModeConsoleStartedMessageOutputter runModeConsoleStartedMessageOutputter() {
		return new RunModeConsoleStartedMessageOutputter();
	}

	@Bean("dorado.simpleApplicationEventMulticaster")
	public DoradoApplicationEventMulticaster simpleApplicationEventMulticaster() {
		return new DoradoApplicationEventMulticaster();
	}

}
