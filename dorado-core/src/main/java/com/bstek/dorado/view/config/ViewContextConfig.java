package com.bstek.dorado.view.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.Cache;
import org.springframework.cache.concurrent.ConcurrentMapCacheFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Lazy;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import com.bstek.dorado.common.service.ExposedServiceManager;
import com.bstek.dorado.common.service.ExposedServiceRegister;
import com.bstek.dorado.config.xml.XmlParser;
import com.bstek.dorado.core.Configure;
import com.bstek.dorado.core.el.ContextVarsInitializer;
import com.bstek.dorado.core.el.CoreContextVarsInitializer;
import com.bstek.dorado.core.el.ExpressionHandler;
import com.bstek.dorado.core.resource.DefaultGlobalResourceBundleManager;
import com.bstek.dorado.core.resource.LocaleResolver;
import com.bstek.dorado.core.xml.XmlDocumentBuilder;
import com.bstek.dorado.data.config.ConfigurableDataConfigManager;
import com.bstek.dorado.data.config.DataConfigLoader;
import com.bstek.dorado.data.config.definition.DataProviderDefinitionManager;
import com.bstek.dorado.data.config.definition.DataResolverDefinitionManager;
import com.bstek.dorado.data.config.definition.DataTypeDefinitionManager;
import com.bstek.dorado.view.DefaultSystemOptionalParametersFactory;
import com.bstek.dorado.view.config.attachment.AttachedJavaScriptResourceManager;
import com.bstek.dorado.view.config.attachment.AttachedResourceManager;
import com.bstek.dorado.view.config.attachment.JavaScriptParser;
import com.bstek.dorado.view.el.ViewContextVarsInitializer;
import com.bstek.dorado.view.el.ViewExpressionHandler;
import com.bstek.dorado.view.loader.PackagesConfigManager;
import com.bstek.dorado.view.longpolling.LongPollingManager;
import com.bstek.dorado.view.manager.ConfigurableViewConfigManager;
import com.bstek.dorado.view.manager.ViewConfigFactoryRegister;
import com.bstek.dorado.view.manager.ViewConfigManager;
import com.bstek.dorado.view.registry.AssembledComponentTypeRegister;
import com.bstek.dorado.view.registry.ComponentTypeRegistry;
import com.bstek.dorado.view.registry.DefaultComponentTypeRegister;
import com.bstek.dorado.view.registry.DefaultComponentTypeRegistry;
import com.bstek.dorado.view.registry.DefaultLayoutTypeRegistry;
import com.bstek.dorado.view.registry.LayoutTypeRegister;
import com.bstek.dorado.view.registry.LayoutTypeRegistry;
import com.bstek.dorado.view.resolver.ClientI18NFileRegister;
import com.bstek.dorado.view.resolver.ClientI18NFileRegistry;
import com.bstek.dorado.view.resolver.ClientSettingsOutputterRegister;
import com.bstek.dorado.view.resolver.DefaultSkinResolver;
import com.bstek.dorado.view.resolver.PageHeaderOutputter;
import com.bstek.dorado.view.resolver.SkinSettingManager;
import com.bstek.dorado.view.resolver.VelocityHelperFactoryBean;
import com.bstek.dorado.view.resource.DefaultViewResourceBundleManager;
import com.bstek.dorado.view.resource.SpringLocaleResolverAdapter;
import com.bstek.dorado.view.resource.ViewResourceManager;
import com.bstek.dorado.view.task.LongTaskAnnotationBeanPostProcessor;
import com.bstek.dorado.view.task.LongTaskSocketServer;

@Configuration
@Import({ ViewComponentsContextConfig.class, ViewLoaderParserContextConfig.class,
		ViewParserContextConfig.class, ViewOutputterContextConfig.class })
public class ViewContextConfig {

	// --- Data Config Loader ---

	@Bean
	public DataConfigLoader viewBaseTypesDataConfigLoader(
			@Qualifier("dorado.dataConfigManager") ConfigurableDataConfigManager dataConfigManager) {
		DataConfigLoader loader = new DataConfigLoader();
		loader.setDataConfigManager(dataConfigManager);
		loader.setConfigLocation("classpath:com/bstek/dorado/view/base-types.xml");
		return loader;
	}

	// --- View Config Definition Cache ---

	@Bean("dorado.viewConfigDefinitionCache")
	public ConcurrentMapCacheFactoryBean viewConfigDefinitionCache() {
		ConcurrentMapCacheFactoryBean bean = new ConcurrentMapCacheFactoryBean();
		bean.setName("com.bstek.dorado.view.config.definition.ViewConfigDefinition");
		return bean;
	}

	// --- XML View Config Definition Factory ---

	@Bean("dorado.xmlViewConfigDefinitionFactory")
	public CacheableXmlViewConfigDefinitionFactory xmlViewConfigDefinitionFactory(
			@Qualifier("dorado.xmlDocumentBuilder") XmlDocumentBuilder xmlDocumentBuilder,
			@Lazy @Qualifier("dorado.viewConfigManager") ViewConfigManager viewConfigManager,
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry componentTypeRegistry,
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.viewConfigDefinitionCache") Cache cache,
			@Qualifier("dorado.viewConfigParser") XmlParser viewConfigParser,
			@Qualifier("dorado.dataTypeDefinitionManager") DataTypeDefinitionManager dataTypeDefinitionManager,
			@Qualifier("dorado.dataProviderDefinitionManager") DataProviderDefinitionManager dataProviderDefinitionManager,
			@Qualifier("dorado.dataResolverDefinitionManager") DataResolverDefinitionManager dataResolverDefinitionManager) {
		CacheableXmlViewConfigDefinitionFactory bean = new CacheableXmlViewConfigDefinitionFactory();
		bean.setXmlDocumentBuilder(xmlDocumentBuilder);

		XmlDocumentPreprocessor preprocessor = new XmlDocumentPreprocessor();
		preprocessor.setViewConfigManager(viewConfigManager);
		preprocessor.setComponentTypeRegistry(componentTypeRegistry);
		preprocessor.setExpressionHandler(expressionHandler);
		bean.setXmlPreprocessor(preprocessor);

		bean.setCache(cache);
		bean.setXmlParser(viewConfigParser);
		bean.setPathSubfix(".view.xml");
		bean.setDataTypeDefinitionManager(dataTypeDefinitionManager);
		bean.setDataProviderDefinitionManager(dataProviderDefinitionManager);
		bean.setDataResolverDefinitionManager(dataResolverDefinitionManager);
		return bean;
	}

	// --- View Config Manager ---

	@Bean("dorado.viewConfigManager")
	public ConfigurableViewConfigManager viewConfigManager(
			@Qualifier("dorado.xmlViewConfigDefinitionFactory") CacheableXmlViewConfigDefinitionFactory xmlViewConfigDefinitionFactory) {
		ConfigurableViewConfigManager bean = new ConfigurableViewConfigManager();
		Map<String, Object> factoryMap = new HashMap<>();
		factoryMap.put("**", xmlViewConfigDefinitionFactory);
		bean.setViewConfigFactoryMap(factoryMap);
		return bean;
	}

	// --- View Config Factory Register (abstract helper + concrete bean) ---

	protected ViewConfigFactoryRegister viewConfigFactoryRegister(ViewConfigManager viewConfigManager) {
		ViewConfigFactoryRegister bean = new ViewConfigFactoryRegister();
		bean.setViewConfigManager(viewConfigManager);
		return bean;
	}

	@Bean("dorado.defaultViewConfigFactoryRegister")
	public ViewConfigFactoryRegister defaultViewConfigFactoryRegister(
			@Qualifier("dorado.viewConfigManager") ViewConfigManager viewConfigManager,
			@Qualifier("dorado.xmlDocumentBuilder") XmlDocumentBuilder xmlDocumentBuilder,
			@Qualifier("dorado.viewConfigDefinitionCache") Cache cache,
			@Qualifier("dorado.viewConfigParser") XmlParser viewConfigParser,
			@Qualifier("dorado.dataTypeDefinitionManager") DataTypeDefinitionManager dataTypeDefinitionManager,
			@Qualifier("dorado.dataProviderDefinitionManager") DataProviderDefinitionManager dataProviderDefinitionManager,
			@Qualifier("dorado.dataResolverDefinitionManager") DataResolverDefinitionManager dataResolverDefinitionManager,
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry componentTypeRegistry) {
		ViewConfigFactoryRegister bean = viewConfigFactoryRegister(viewConfigManager);
		bean.setViewNamePattern("**");

		CacheableXmlViewConfigDefinitionFactory factory = new CacheableXmlViewConfigDefinitionFactory();
		factory.setXmlDocumentBuilder(xmlDocumentBuilder);
		XmlDocumentPreprocessor preprocessor = new XmlDocumentPreprocessor();
		preprocessor.setViewConfigManager(viewConfigManager);
		preprocessor.setComponentTypeRegistry(componentTypeRegistry);
		preprocessor.setExpressionHandler(expressionHandler);
		factory.setXmlPreprocessor(preprocessor);
		factory.setCache(cache);
		factory.setXmlParser(viewConfigParser);
		factory.setPathSubfix(".view.xml");
		factory.setDataTypeDefinitionManager(dataTypeDefinitionManager);
		factory.setDataProviderDefinitionManager(dataProviderDefinitionManager);
		factory.setDataResolverDefinitionManager(dataResolverDefinitionManager);
		factory.setPathPrefix(Configure.getString("view.root", "classpath:"));
		bean.setViewConfigFactory(factory);
		return bean;
	}

	// --- Component Type Registry ---

	@Bean("dorado.componentTypeRegistry")
	public DefaultComponentTypeRegistry componentTypeRegistry() {
		return new DefaultComponentTypeRegistry();
	}

	// --- Abstract register helpers ---

	protected DefaultComponentTypeRegister componentTypeRegister(ComponentTypeRegistry componentTypeRegistry) {
		DefaultComponentTypeRegister bean = new DefaultComponentTypeRegister();
		bean.setComponentTypeRegistry(componentTypeRegistry);
		return bean;
	}

	protected DefaultComponentTypeRegister defaultComponentTypeRegister(ComponentTypeRegistry componentTypeRegistry) {
		DefaultComponentTypeRegister bean = new DefaultComponentTypeRegister();
		bean.setComponentTypeRegistry(componentTypeRegistry);
		return bean;
	}

	protected AssembledComponentTypeRegister assembledComponentTypeRegister(ComponentTypeRegistry componentTypeRegistry,
			ViewConfigManager viewConfigManager) {
		AssembledComponentTypeRegister bean = new AssembledComponentTypeRegister();
		bean.setComponentTypeRegistry(componentTypeRegistry);
		bean.setViewConfigManager(viewConfigManager);
		return bean;
	}

	// --- Layout Type Registry ---

	@Bean("dorado.layoutTypeRegistry")
	public DefaultLayoutTypeRegistry layoutTypeRegistry() {
		DefaultLayoutTypeRegistry bean = new DefaultLayoutTypeRegistry();
		bean.setDefaultType("Dock");
		return bean;
	}

	protected LayoutTypeRegister layoutTypeRegister(LayoutTypeRegistry layoutTypeRegistry) {
		LayoutTypeRegister bean = new LayoutTypeRegister();
		bean.setLayoutTypeRegistry(layoutTypeRegistry);
		return bean;
	}

	// --- Expression Handler (overrides core's) ---

	@Bean("dorado.expressionHandler")
	public ViewExpressionHandler expressionHandler() {
		ViewExpressionHandler bean = new ViewExpressionHandler();
		// ContextVarsInitializerRegister 会在运行期向该列表追加元素，必须使用可变列表
		bean.setContextInitializers(new ArrayList<>(Arrays.<ContextVarsInitializer>asList(
				new CoreContextVarsInitializer(),
				new ViewContextVarsInitializer())));
		return bean;
	}

	// --- System Optional Parameters Factory ---

	@Bean("dorado.systemOptionalParametersFactory")
	public DefaultSystemOptionalParametersFactory systemOptionalParametersFactory() {
		return new DefaultSystemOptionalParametersFactory();
	}

	// --- Packages Config ---

	@Bean("dorado.packagesConfigManager")
	public PackagesConfigManager packagesConfigManager(
			@Qualifier("dorado.xmlDocumentBuilder") XmlDocumentBuilder xmlDocumentBuilder,
			@Qualifier("dorado.packagesConfigParser") XmlParser packagesConfigParser) {
		PackagesConfigManager bean = new PackagesConfigManager();
		bean.setXmlDocumentBuilder(xmlDocumentBuilder);
		bean.setXmlParser(packagesConfigParser);
		return bean;
	}

	protected com.bstek.dorado.view.loader.PackagesConfigLoader packagesConfigLoader(
			PackagesConfigManager packagesConfigManager) {
		com.bstek.dorado.view.loader.PackagesConfigLoader bean = new com.bstek.dorado.view.loader.PackagesConfigLoader();
		bean.setPackagesConfigManager(packagesConfigManager);
		return bean;
	}

	// --- Velocity Helper ---

	@Bean("dorado.velocityHelper")
	public VelocityHelperFactoryBean velocityHelper() {
		VelocityHelperFactoryBean bean = new VelocityHelperFactoryBean();

		Properties velocityProperties = new Properties();
		velocityProperties.setProperty("input.encoding", "UTF-8");
		velocityProperties.setProperty("output.encoding", "UTF-8");
		velocityProperties.setProperty("resource.loader", "view");
		velocityProperties.setProperty("runtime.log.logsystem.class",
				"org.apache.velocity.runtime.log.NullLogChute");
		velocityProperties.setProperty("view.resource.loader.description", "Dorado File Resource Loader");
		velocityProperties.setProperty("view.resource.loader.class",
				"com.bstek.dorado.view.resolver.VelocityViewTemplateResourceLoader");
		velocityProperties.setProperty("view.resource.loader.cache",
				Configure.getString("view.templateCachingOn", "true"));
		velocityProperties.setProperty("view.resource.loader.modificationCheckInterval",
				Configure.getString("view.templateModificationCheckInterval", "5"));
		velocityProperties.setProperty("userdirective",
				"com.bstek.dorado.view.resolver.VelocityPageHeaderDirective,"
						+ "com.bstek.dorado.view.resolver.VelocityPageFooterDirective,"
						+ "com.bstek.dorado.view.resolver.VelocityInterceptorDirective,"
						+ "com.bstek.dorado.view.resolver.VelocityExceptionDirective");
		bean.setVelocityProperties(velocityProperties);

		Properties velocityToolProperties = new Properties();
		velocityToolProperties.setProperty("tools.application.date",
				"org.apache.velocity.tools.generic.DateTool");
		bean.setVelocityToolProperties(velocityToolProperties);

		return bean;
	}

	// --- Locale Resolver (overrides core's) ---

	@Bean("dorado.localeResolver")
	public SpringLocaleResolverAdapter localeResolver() {
		SpringLocaleResolverAdapter bean = new SpringLocaleResolverAdapter();
		bean.setSpringLocaleResolver(new AcceptHeaderLocaleResolver());
		return bean;
	}

	// --- Skin ---

	@Bean("dorado.skinSettingManager")
	public SkinSettingManager skinSettingManager() {
		return new SkinSettingManager();
	}

	@Bean("dorado.skinResolver")
	public DefaultSkinResolver skinResolver(
			@Qualifier("dorado.skinSettingManager") SkinSettingManager skinSettingManager) {
		DefaultSkinResolver bean = new DefaultSkinResolver();
		bean.setSkinSettingManager(skinSettingManager);
		return bean;
	}

	// --- Client I18N ---

	@Bean("dorado.clientI18NFileRegistry")
	public ClientI18NFileRegistry clientI18NFileRegistry() {
		return new ClientI18NFileRegistry();
	}

	protected ClientI18NFileRegister clientI18NFileRegister(ClientI18NFileRegistry clientI18NFileRegistry) {
		ClientI18NFileRegister bean = new ClientI18NFileRegister();
		bean.setClientI18NFileRegistry(clientI18NFileRegistry);
		return bean;
	}

	// --- View Resource ---

	@Bean("dorado.viewResourceBundleManager")
	public DefaultViewResourceBundleManager viewResourceBundleManager(
			@Qualifier("dorado.privateResourceCache") Cache privateResourceCache) {
		DefaultViewResourceBundleManager bean = new DefaultViewResourceBundleManager();
		bean.setCache(privateResourceCache);
		return bean;
	}

	@Bean("dorado.viewResourceManager")
	public ViewResourceManager viewResourceManager(
			@Qualifier("dorado.viewResourceBundleManager") DefaultViewResourceBundleManager viewResourceBundleManager,
			@Qualifier("dorado.globalResourceBundleManager") DefaultGlobalResourceBundleManager globalResourceBundleManager,
			Locale defaultLocale,
			@Qualifier("dorado.localeResolver") LocaleResolver localeResolver) {
		ViewResourceManager bean = new ViewResourceManager();
		bean.setViewResourceBundleManager(viewResourceBundleManager);
		// Properties from parent=dorado.abstractResourceManager
		bean.setGlobalResourceBundleManager(globalResourceBundleManager);
		bean.setDefaultLocale(defaultLocale);
		bean.setLocaleResolver(localeResolver);
		return bean;
	}

	// --- View Attachment Resources ---

	@Bean("dorado.viewAttachmentCache")
	public ConcurrentMapCacheFactoryBean viewAttachmentCache() {
		ConcurrentMapCacheFactoryBean bean = new ConcurrentMapCacheFactoryBean();
		bean.setName("com.bstek.dorado.view.config.attachment.AttachedResourceManager");
		return bean;
	}

	protected AttachedResourceManager viewAttachmentResourceManager(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.viewAttachmentCache") Cache cache) {
		AttachedResourceManager bean = new AttachedResourceManager();
		bean.setExpressionHandler(expressionHandler);
		bean.setCache(cache);
		return bean;
	}

	@Bean("dorado.viewStyleSheetResourceManager")
	public AttachedResourceManager viewStyleSheetResourceManager(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.viewAttachmentCache") Cache cache) {
		AttachedResourceManager bean = new AttachedResourceManager();
		bean.setExpressionHandler(expressionHandler);
		bean.setCache(cache);
		bean.setCharset(Configure.getString("view.styleSheet.charset"));
		return bean;
	}

	@Bean("dorado.viewJavaScriptResourceManager")
	public AttachedJavaScriptResourceManager viewJavaScriptResourceManager(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.viewAttachmentCache") Cache cache) {
		AttachedJavaScriptResourceManager bean = new AttachedJavaScriptResourceManager();
		bean.setExpressionHandler(expressionHandler);
		bean.setCache(cache);
		bean.setCharset(Configure.getString("view.javaScript.charset"));
		bean.setAsControllerInDefault(com.bstek.dorado.core.Configure.getBoolean("view.javaScript.asControllerInDefault"));
		bean.setJavaScriptParser(new JavaScriptParser());
		return bean;
	}

	// --- Client Settings ---

	protected ClientSettingsOutputterRegister clientSettingsOutputterRegister(
			PageHeaderOutputter pageHeaderOutputter) {
		ClientSettingsOutputterRegister bean = new ClientSettingsOutputterRegister();
		bean.setPageHeaderOutputter(pageHeaderOutputter);
		return bean;
	}

	// --- Long Polling ---

	@Bean("dorado.longPollingManager")
	public LongPollingManager longPollingManager() {
		return new LongPollingManager();
	}

	// --- Long Task ---

	@Bean("dorado.longTaskSocketServer")
	public LongTaskSocketServer longTaskSocketServer(
			@Qualifier("dorado.exposedServiceManager") ExposedServiceManager exposedServiceManager,
			@Qualifier("dorado.longPollingManager") LongPollingManager longPollingManager) {
		LongTaskSocketServer bean = new LongTaskSocketServer();
		bean.setExposedServiceManager(exposedServiceManager);
		bean.setLongPollingManager(longPollingManager);
		return bean;
	}

	@Bean
	public LongTaskAnnotationBeanPostProcessor longTaskAnnotationBeanPostProcessor(
			@Qualifier("dorado.exposedServiceManager") ExposedServiceManager exposedServiceManager) {
		LongTaskAnnotationBeanPostProcessor bean = new LongTaskAnnotationBeanPostProcessor();
		bean.setExposedServiceManager(exposedServiceManager);
		return bean;
	}

	@Bean
	public ExposedServiceRegister longTaskExposedServiceRegister(
			@Qualifier("dorado.exposedServiceManager") ExposedServiceManager exposedServiceManager) {
		ExposedServiceRegister bean = new ExposedServiceRegister();
		bean.setExposedServiceManager(exposedServiceManager);
		Map<String, String> services = new HashMap<>();
		services.put("dorado.connectLongTask", "spring:dorado.longTaskSocketServer#connectLongTask");
		services.put("dorado.startLongTask", "spring:dorado.longTaskSocketServer#startLongTask");
		bean.setServices(services);
		return bean;
	}
}
