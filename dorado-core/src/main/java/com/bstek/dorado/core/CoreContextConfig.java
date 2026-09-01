package com.bstek.dorado.core;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.concurrent.ConcurrentMapCacheFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.bstek.dorado.core.bean.BeanFactoryRegister;
import com.bstek.dorado.core.bean.BeanFactoryUtilsInitializer;
import com.bstek.dorado.core.bean.ClassNameBeanFactory;
import com.bstek.dorado.core.bean.DefaultBeanFactoryRegistry;
import com.bstek.dorado.core.bean.ScopeManager;
import com.bstek.dorado.core.el.ContextVarsInitializerRegister;
import com.bstek.dorado.core.el.CoreContextVarsInitializer;
import com.bstek.dorado.core.el.DefaultExpressionHandler;
import com.bstek.dorado.core.io.LocationTransformerRegister;
import com.bstek.dorado.core.io.StoreLocationTransformer;
import com.bstek.dorado.core.resource.DefaultGlobalResourceBundleManager;
import com.bstek.dorado.core.resource.DefaultResourceManager;
import com.bstek.dorado.core.resource.EmptyLocaleResolver;
import com.bstek.dorado.core.resource.GlobalResourceSearchPathRegister;
import com.bstek.dorado.core.resource.LocaleResolver;
import com.bstek.dorado.core.store.H2BaseStore;
import com.bstek.dorado.core.xml.XercesXmlDocumentBuilder;
import com.bstek.dorado.util.proxy.JavaAssistClassLoader;

import javassist.util.proxy.ProxyFactory;

@Configuration
public class CoreContextConfig {

	@Bean("dorado.configurePropertiesConfigurer")
	public ConfigurePropertiesConfigurer configurePropertiesConfigurer() {
		return new ConfigurePropertiesConfigurer();
	}

	@Bean("dorado.baseEngineStartupListener")
	public BaseEngineStartupListener baseEngineStartupListener() {
		BaseEngineStartupListener bean = new BaseEngineStartupListener();
		bean.setOrder(0);
		return bean;
	}

	@Bean("dorado.storeLocationTransformerRegister")
	public LocationTransformerRegister storeLocationTransformerRegister() {
		LocationTransformerRegister bean = new LocationTransformerRegister();
		bean.setProtocal("store:");
		bean.setTransformer(new StoreLocationTransformer());
		return bean;
	}

	@Bean("dorado.xmlDocumentBuilder")
	public XercesXmlDocumentBuilder xmlDocumentBuilder() {
		return new XercesXmlDocumentBuilder();
	}

	@Bean("dorado.scopeManager")
	public ScopeManager scopeManager() {
		return new ScopeManager();
	}

	@Bean("dorado.beanFactoryRegistry")
	public DefaultBeanFactoryRegistry beanFactoryRegistry() {
		DefaultBeanFactoryRegistry bean = new DefaultBeanFactoryRegistry();
		bean.setDefaultPrefix("class");
		bean.setBeanFactories(List.of(new ClassNameBeanFactory()));
		return bean;
	}

	/**
	 * Abstract bean definition helper for dorado.beanFactoryRegister.
	 */
	protected BeanFactoryRegister beanFactoryRegister() {
		BeanFactoryRegister bean = new BeanFactoryRegister();
		bean.setBeanFactoryRegistry(beanFactoryRegistry());
		return bean;
	}

	@Bean("dorado.beanFactoryUtilsInitializer")
	public BeanFactoryUtilsInitializer beanFactoryUtilsInitializer() {
		BeanFactoryUtilsInitializer bean = new BeanFactoryUtilsInitializer();
		bean.setBeanFactoryRegistry(beanFactoryRegistry());
		bean.setScopeManager(scopeManager());
		return bean;
	}

	@Bean("dorado.expressionHandler")
	public DefaultExpressionHandler expressionHandler() {
		DefaultExpressionHandler bean = new DefaultExpressionHandler();
		// ContextVarsInitializerRegister 会在运行期向该列表追加元素，必须使用可变列表
		bean.setContextInitializers(new ArrayList<>(List.of(new CoreContextVarsInitializer())));
		return bean;
	}

	/**
	 * Abstract bean definition helper for dorado.expressionVarsInitializerRegister.
	 */
	protected ContextVarsInitializerRegister expressionVarsInitializerRegister() {
		return new ContextVarsInitializerRegister();
	}

	@Bean("dorado.globalResourceCache")
	public ConcurrentMapCacheFactoryBean globalResourceCache() {
		ConcurrentMapCacheFactoryBean bean = new ConcurrentMapCacheFactoryBean();
		bean.setName("com.bstek.dorado.view.resource.GlobalResourceCache");
		return bean;
	}

	@Bean("dorado.privateResourceCache")
	public ConcurrentMapCacheFactoryBean privateResourceCache() {
		ConcurrentMapCacheFactoryBean bean = new ConcurrentMapCacheFactoryBean();
		bean.setName("com.bstek.dorado.view.resource.ModelResourceCache");
		return bean;
	}

	@Bean("dorado.defaultLocale")
	public Locale defaultLocale(
			@Value("${core.defaultLanguage}") String language,
			@Value("${core.defaultCountry}") String country) {
		return Locale.of(language, country);
	}

	@Bean("dorado.localeResolver")
	public EmptyLocaleResolver localeResolver() {
		return new EmptyLocaleResolver();
	}

	@Bean("dorado.globalResourceBundleManager")
	public DefaultGlobalResourceBundleManager globalResourceBundleManager(
			@Qualifier("dorado.globalResourceCache") Cache globalResourceCache) {
		DefaultGlobalResourceBundleManager bean = new DefaultGlobalResourceBundleManager();
		bean.setCache(globalResourceCache);
		return bean;
	}

	/**
	 * Abstract bean definition helper for dorado.globalResourceSearchPathRegister.
	 */
	protected GlobalResourceSearchPathRegister globalResourceSearchPathRegister(
			DefaultGlobalResourceBundleManager globalResourceBundleManager) {
		GlobalResourceSearchPathRegister bean = new GlobalResourceSearchPathRegister();
		bean.setGlobalResourceBundleManager(globalResourceBundleManager);
		return bean;
	}

	/**
	 * Abstract bean definition helper for dorado.abstractResourceManager.
	 * Provides common property initialization for resource manager beans.
	 * <p>
	 * The locale resolver is injected by the {@code LocaleResolver} interface
	 * (not the concrete {@link EmptyLocaleResolver}) so that applications can
	 * override the default {@code dorado.localeResolver} bean with their own
	 * implementation - exactly like in a classic web.xml deployment.
	 * </p>
	 */
	protected DefaultResourceManager abstractResourceManager(
			DefaultGlobalResourceBundleManager globalResourceBundleManager,
			Locale defaultLocale, LocaleResolver localeResolver) {
		DefaultResourceManager bean = new DefaultResourceManager();
		bean.setGlobalResourceBundleManager(globalResourceBundleManager);
		bean.setDefaultLocale(defaultLocale);
		bean.setLocaleResolver(localeResolver);
		return bean;
	}

	@Bean("dorado.resourceManager")
	@Scope("prototype")
	public DefaultResourceManager resourceManager(
			DefaultGlobalResourceBundleManager globalResourceBundleManager,
			Locale defaultLocale, LocaleResolver localeResolver) {
		return abstractResourceManager(globalResourceBundleManager, defaultLocale, localeResolver);
	}

	@Bean("dorado.coreGlobalResourceSearchPathRegister")
	public GlobalResourceSearchPathRegister coreGlobalResourceSearchPathRegister(
			DefaultGlobalResourceBundleManager globalResourceBundleManager) {
		GlobalResourceSearchPathRegister bean = globalResourceSearchPathRegister(globalResourceBundleManager);
		bean.setSearchPath("com/bstek/dorado/core/resource/");
		return bean;
	}

	/**
	 * Abstract bean definition helper for dorado.sqlBaseStore.
	 */
	protected H2BaseStore sqlBaseStore() {
		H2BaseStore bean = new H2BaseStore();
		bean.setDriverClassName("org.h2.Driver");
		bean.setUsername("dorado");
		bean.setPassword("www.bstek.com");
		return bean;
	}

	@Bean("javaAssistClassLoader")
	public ProxyFactory.ClassLoaderProvider javaAssistClassLoader() {
		return JavaAssistClassLoader.createJavaAssistClassLoader();
	}

}
