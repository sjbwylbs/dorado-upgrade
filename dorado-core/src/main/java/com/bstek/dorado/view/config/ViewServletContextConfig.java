package com.bstek.dorado.view.config;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.common.service.ExposedServiceManager;
import com.bstek.dorado.core.Configure;
import com.bstek.dorado.core.io.LocationTransformerRegister;
import com.bstek.dorado.core.resource.LocaleResolver;
import com.bstek.dorado.data.config.DataConfigManager;
import com.bstek.dorado.data.provider.filter.FilterCriterionParser;
import com.bstek.dorado.data.provider.manager.DataProviderManager;
import com.bstek.dorado.data.resolver.manager.DataResolverManager;
import com.bstek.dorado.data.type.manager.DataTypeManager;
import com.bstek.dorado.view.longpolling.LongPollingManager;
import com.bstek.dorado.view.manager.ViewConfigManager;
import com.bstek.dorado.view.output.ClientObjectOutputter;
import com.bstek.dorado.view.output.ClientOutputHelper;
import com.bstek.dorado.view.output.DataOutputter;
import com.bstek.dorado.view.output.IncludeDataTypesOutputter;
import com.bstek.dorado.view.registry.AbstractVelocityResolver;
import com.bstek.dorado.view.resolver.BootPackagesResolver;
import com.bstek.dorado.view.resolver.ClientI18NFileRegistry;
import com.bstek.dorado.view.resolver.FontAwesomeLocationTransformer;
import com.bstek.dorado.view.resolver.FontAwesomePngFileResolver;
import com.bstek.dorado.view.resolver.HtmlViewResolver;
import com.bstek.dorado.view.resolver.IE6PngFileResolver;
import com.bstek.dorado.view.resolver.LibraryFileResolver;
import com.bstek.dorado.view.resolver.OldIconsFileResolver;
import com.bstek.dorado.view.resolver.PackageFileResolver;
import com.bstek.dorado.view.resolver.SkinFileResolver;
import com.bstek.dorado.view.resolver.VelocityHelper;
import com.bstek.dorado.view.resolver.ViewResolverListenerRegister;
import com.bstek.dorado.view.resolver.ViewServiceResolver;
import com.bstek.dorado.view.service.LoadDataServiceProcessor;
import com.bstek.dorado.view.service.LoadDataTypeServiceProcessor;
import com.bstek.dorado.view.service.LoadViewServiceProcessor;
import com.bstek.dorado.view.service.LongPollingServiceProcessor;
import com.bstek.dorado.view.service.RemoteServiceProcessor;
import com.bstek.dorado.view.service.ResolveDataServiceProcessor;
import com.bstek.dorado.view.service.ServiceProcessor;
import com.bstek.dorado.web.resolver.ResolverRegister;
import com.bstek.dorado.web.resolver.ResolverRegisterProcessor;
import com.bstek.dorado.web.resolver.ResourceFileResolver;

@Configuration
public class ViewServletContextConfig {

	// --- Helper methods ---

	protected ResolverRegister resolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			int order, String url, Object resolver) {
		ResolverRegister bean = new ResolverRegister();
		bean.setResolverRegisterProcessor(resolverRegisterProcessor);
		bean.setOrder(order);
		bean.setUrl(url);
		bean.setResolver(resolver);
		return bean;
	}

	// --- Abstract bean helpers (NOT @Bean) ---

	protected AbstractVelocityResolver abstractVelocityResolver(VelocityHelper velocityHelper) {
		// This is abstract - used as helper only
		return null; // placeholder, not actually instantiated
	}

	protected ViewResolverListenerRegister viewResolverListenerRegister(HtmlViewResolver htmlViewResolver) {
		// This is abstract - used as helper only
		return null; // placeholder, not actually instantiated
	}

	// --- File Resolvers ---

	@Bean("dorado.libraryFileResolver")
	public LibraryFileResolver libraryFileResolver(
			@Qualifier("dorado.clientI18NFileRegistry") ClientI18NFileRegistry clientI18NFileRegistry,
			Locale defaultLocale,
			@Qualifier("dorado.localeResolver") LocaleResolver localeResolver) {
		LibraryFileResolver bean = new LibraryFileResolver();
		bean.setClientI18NFileRegistry(clientI18NFileRegistry);
		bean.setDefaultLocale(defaultLocale);
		bean.setLocaleResolver(localeResolver);
		bean.setResourcePrefix(Configure.getString("view.libraryRoot", "classpath:dorado"));
		return bean;
	}

	@Bean("dorado.libraryResolverRegister")
	public ResolverRegister libraryResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.libraryFileResolver") LibraryFileResolver libraryFileResolver) {
		return resolverRegister(resolverRegisterProcessor, 10, "/dorado/client/**/*.dpkg", libraryFileResolver);
	}

	@Bean("dorado.packageFileResolver")
	public PackageFileResolver packageFileResolver(
			@Qualifier("dorado.clientI18NFileRegistry") ClientI18NFileRegistry clientI18NFileRegistry,
			Locale defaultLocale,
			@Qualifier("dorado.localeResolver") LocaleResolver localeResolver) {
		PackageFileResolver bean = new PackageFileResolver();
		bean.setClientI18NFileRegistry(clientI18NFileRegistry);
		bean.setDefaultLocale(defaultLocale);
		bean.setLocaleResolver(localeResolver);
		return bean;
	}

	@Bean("dorado.packageResolverRegister")
	public ResolverRegister packageResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.packageFileResolver") PackageFileResolver packageFileResolver) {
		return resolverRegister(resolverRegisterProcessor, 20, "**/*.dpkg", packageFileResolver);
	}

	@Bean("dorado.bootPackagesResolver")
	public BootPackagesResolver bootPackagesResolver(
			@Qualifier("dorado.localeResolver") LocaleResolver localeResolver) {
		BootPackagesResolver bean = new BootPackagesResolver();
		bean.setLocaleResolver(localeResolver);
		bean.setBootFile("scripts/dorado/boot");
		bean.setResourcePrefix(Configure.getString("view.libraryRoot", "classpath:dorado"));
		return bean;
	}

	@Bean("dorado.bootResolverRegister")
	public ResolverRegister bootResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.bootPackagesResolver") BootPackagesResolver bootPackagesResolver) {
		return resolverRegister(resolverRegisterProcessor, 30, "/dorado/client/boot.dpkg", bootPackagesResolver);
	}

	@Bean("dorado.skinFileResolver")
	public SkinFileResolver skinFileResolver() {
		SkinFileResolver bean = new SkinFileResolver();
		bean.setBaseUri("/dorado/client");
		bean.setResourcePrefix(Configure.getString("view.libraryRoot", "classpath:dorado"));
		return bean;
	}

	@Bean("dorado.skinResolverRegister")
	public ResolverRegister skinResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.skinFileResolver") SkinFileResolver skinFileResolver) {
		return resolverRegister(resolverRegisterProcessor, 40, "/dorado/client/skins/**", skinFileResolver);
	}

	@Bean("dorado.sysResourceFileResolver")
	public ResourceFileResolver sysResourceFileResolver() {
		ResourceFileResolver bean = new ResourceFileResolver();
		bean.setBaseUri("/dorado/client");
		bean.setResourcePrefix(Configure.getString("view.libraryRoot", "classpath:dorado"));
		return bean;
	}

	@Bean("dorado.sysResourceResolverRegister")
	public ResolverRegister sysResourceResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.sysResourceFileResolver") ResourceFileResolver sysResourceFileResolver) {
		return resolverRegister(resolverRegisterProcessor, 50, "/dorado/client/resources/**", sysResourceFileResolver);
	}

	@Bean("dorado.userResourceFileResolver")
	public ResourceFileResolver userResourceFileResolver() {
		ResourceFileResolver bean = new ResourceFileResolver();
		bean.setBaseUri("/dorado/res");
		bean.setResourcePrefix("classpath:");
		return bean;
	}

	@Bean("dorado.resourcesResolverRegister")
	public ResolverRegister resourcesResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.userResourceFileResolver") ResourceFileResolver userResourceFileResolver) {
		return resolverRegister(resolverRegisterProcessor, 60, "/dorado/res/**", userResourceFileResolver);
	}

	// --- Services ---

	@Bean("dorado.viewServiceResolver")
	public ViewServiceResolver viewServiceResolver(
			@Qualifier("dorado.loadDataTypeServiceProcessor") LoadDataTypeServiceProcessor loadDataTypeServiceProcessor,
			@Qualifier("dorado.loadDataServiceProcessor") LoadDataServiceProcessor loadDataServiceProcessor,
			@Qualifier("dorado.resolveDataServiceProcessor") ResolveDataServiceProcessor resolveDataServiceProcessor,
			@Qualifier("dorado.remoteServiceProcessor") RemoteServiceProcessor remoteServiceProcessor,
			@Qualifier("dorado.longPollingServiceProcessor") LongPollingServiceProcessor longPollingServiceProcessor,
			@Qualifier("dorado.loadViewServiceProcessor") LoadViewServiceProcessor loadViewServiceProcessor) {
		ViewServiceResolver bean = new ViewServiceResolver();
		Map<String, ServiceProcessor> serviceProcessors = new LinkedHashMap<>();
		serviceProcessors.put("load-datatype", loadDataTypeServiceProcessor);
		serviceProcessors.put("load-data", loadDataServiceProcessor);
		serviceProcessors.put("resolve-data", resolveDataServiceProcessor);
		serviceProcessors.put("remote-service", remoteServiceProcessor);
		serviceProcessors.put("long-polling", longPollingServiceProcessor);
		serviceProcessors.put("load-view", loadViewServiceProcessor);
		bean.setServiceProcessors(serviceProcessors);
		return bean;
	}

	@Bean("dorado.viewServiceResolverRegister")
	public ResolverRegister viewServiceResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.viewServiceResolver") ViewServiceResolver viewServiceResolver) {
		return resolverRegister(resolverRegisterProcessor, 70, "/dorado/view-service", viewServiceResolver);
	}

	// --- Service Processors ---

	@Bean("dorado.loadDataTypeServiceProcessor")
	public LoadDataTypeServiceProcessor loadDataTypeServiceProcessor(
			@Qualifier("dorado.dataTypeManager") DataTypeManager dataTypeManager,
			@Qualifier("dorado.viewConfigManager") ViewConfigManager viewConfigManager,
			@Qualifier("dorado.dataOutputter") DataOutputter dataOutputter,
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter) {
		LoadDataTypeServiceProcessor bean = new LoadDataTypeServiceProcessor();
		bean.setDataTypeManager(dataTypeManager);
		bean.setViewConfigManager(viewConfigManager);
		bean.setDataOutputter(dataOutputter);
		IncludeDataTypesOutputter includeDtOutputter = new IncludeDataTypesOutputter();
		includeDtOutputter.setClientOutputHelper(clientOutputHelper);
		includeDtOutputter.setDefaultObjectOutputter(objectOutputter);
		bean.setIncludeDataTypesOutputter(includeDtOutputter);
		return bean;
	}

	@Bean("dorado.loadDataServiceProcessor")
	public LoadDataServiceProcessor loadDataServiceProcessor(
			@Qualifier("dorado.dataTypeManager") DataTypeManager dataTypeManager,
			@Qualifier("dorado.viewConfigManager") ViewConfigManager viewConfigManager,
			@Qualifier("dorado.dataOutputter") DataOutputter dataOutputter,
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter,
			@Qualifier("dorado.dataProviderManager") DataProviderManager dataProviderManager,
			@Qualifier("dorado.filterCriterionParser") FilterCriterionParser filterCriterionParser) {
		LoadDataServiceProcessor bean = new LoadDataServiceProcessor();
		bean.setDataTypeManager(dataTypeManager);
		bean.setViewConfigManager(viewConfigManager);
		bean.setDataOutputter(dataOutputter);
		IncludeDataTypesOutputter includeDtOutputter = new IncludeDataTypesOutputter();
		includeDtOutputter.setClientOutputHelper(clientOutputHelper);
		includeDtOutputter.setDefaultObjectOutputter(objectOutputter);
		bean.setIncludeDataTypesOutputter(includeDtOutputter);
		bean.setDataProviderManager(dataProviderManager);
		bean.setFilterCriterionParser(filterCriterionParser);
		return bean;
	}

	@Bean("dorado.resolveDataServiceProcessor")
	public ResolveDataServiceProcessor resolveDataServiceProcessor(
			@Qualifier("dorado.dataTypeManager") DataTypeManager dataTypeManager,
			@Qualifier("dorado.viewConfigManager") ViewConfigManager viewConfigManager,
			@Qualifier("dorado.dataOutputter") DataOutputter dataOutputter,
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter,
			@Qualifier("dorado.dataResolverManager") DataResolverManager dataResolverManager) {
		ResolveDataServiceProcessor bean = new ResolveDataServiceProcessor();
		bean.setDataTypeManager(dataTypeManager);
		bean.setViewConfigManager(viewConfigManager);
		bean.setDataOutputter(dataOutputter);
		IncludeDataTypesOutputter includeDtOutputter = new IncludeDataTypesOutputter();
		includeDtOutputter.setClientOutputHelper(clientOutputHelper);
		includeDtOutputter.setDefaultObjectOutputter(objectOutputter);
		bean.setIncludeDataTypesOutputter(includeDtOutputter);
		bean.setDataResolverManager(dataResolverManager);

		// simplePropertyValueOnlyDataOutputter: anonymous bean with parent=dataOutputter
		DataOutputter simpleOutputter = new DataOutputter();
		simpleOutputter.setSimplePropertyValueOnly(true);
		bean.setSimplePropertyValueOnlyDataOutputter(simpleOutputter);
		return bean;
	}

	@Bean("dorado.remoteServiceProcessor")
	public RemoteServiceProcessor remoteServiceProcessor(
			@Qualifier("dorado.dataTypeManager") DataTypeManager dataTypeManager,
			@Qualifier("dorado.viewConfigManager") ViewConfigManager viewConfigManager,
			@Qualifier("dorado.dataOutputter") DataOutputter dataOutputter,
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter,
			@Qualifier("dorado.exposedServiceManager") ExposedServiceManager exposedServiceManager) {
		RemoteServiceProcessor bean = new RemoteServiceProcessor();
		bean.setDataTypeManager(dataTypeManager);
		bean.setViewConfigManager(viewConfigManager);
		bean.setDataOutputter(dataOutputter);
		IncludeDataTypesOutputter includeDtOutputter = new IncludeDataTypesOutputter();
		includeDtOutputter.setClientOutputHelper(clientOutputHelper);
		includeDtOutputter.setDefaultObjectOutputter(objectOutputter);
		bean.setIncludeDataTypesOutputter(includeDtOutputter);
		bean.setExposedServiceManager(exposedServiceManager);
		return bean;
	}

	@Bean("dorado.longPollingServiceProcessor")
	public LongPollingServiceProcessor longPollingServiceProcessor(
			@Qualifier("dorado.dataTypeManager") DataTypeManager dataTypeManager,
			@Qualifier("dorado.viewConfigManager") ViewConfigManager viewConfigManager,
			@Qualifier("dorado.dataOutputter") DataOutputter dataOutputter,
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.objectOutputter") ClientObjectOutputter objectOutputter,
			@Qualifier("dorado.exposedServiceManager") ExposedServiceManager exposedServiceManager,
			@Qualifier("dorado.longPollingManager") LongPollingManager longPollingManager) {
		LongPollingServiceProcessor bean = new LongPollingServiceProcessor();
		bean.setDataTypeManager(dataTypeManager);
		bean.setViewConfigManager(viewConfigManager);
		bean.setDataOutputter(dataOutputter);
		IncludeDataTypesOutputter includeDtOutputter = new IncludeDataTypesOutputter();
		includeDtOutputter.setClientOutputHelper(clientOutputHelper);
		includeDtOutputter.setDefaultObjectOutputter(objectOutputter);
		bean.setIncludeDataTypesOutputter(includeDtOutputter);
		bean.setExposedServiceManager(exposedServiceManager);
		bean.setLongPollingManager(longPollingManager);
		return bean;
	}

	@Bean("dorado.loadViewServiceProcessor")
	public LoadViewServiceProcessor loadViewServiceProcessor(
			@Qualifier("dorado.viewConfigManager") ViewConfigManager viewConfigManager,
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper) {
		LoadViewServiceProcessor bean = new LoadViewServiceProcessor();
		bean.setViewConfigManager(viewConfigManager);
		bean.setClientOutputHelper(clientOutputHelper);
		return bean;
	}

	// --- HTML View Resolver ---

	@Bean("dorado.htmlViewResolver")
	public HtmlViewResolver htmlViewResolver(
			@Qualifier("dorado.dataConfigManager") DataConfigManager dataConfigManager,
			@Qualifier("dorado.viewConfigManager") ViewConfigManager viewConfigManager,
			@Qualifier("dorado.velocityHelper") VelocityHelper velocityHelper) {
		HtmlViewResolver bean = new HtmlViewResolver();
		bean.setTouchUserAgents(Configure.getString("view.touchUserAgents"));
		bean.setTemplateFile(
				"home:w3c-html4-template.html,classpath:com/bstek/dorado/view/resolver/w3c-html4-template.html");
		bean.setDataConfigManager(dataConfigManager);
		bean.setViewConfigManager(viewConfigManager);
		bean.setVelocityHelper(velocityHelper);
		bean.setUriSuffix(".d");
		return bean;
	}

	@Bean("dorado.viewResolverRegister")
	public ResolverRegister viewResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.htmlViewResolver") HtmlViewResolver htmlViewResolver) {
		return resolverRegister(resolverRegisterProcessor, 100, "**/*.d", htmlViewResolver);
	}

	// --- Deprecated Resolvers ---

}
