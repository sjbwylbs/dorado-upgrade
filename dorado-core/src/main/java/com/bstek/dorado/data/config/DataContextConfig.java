package com.bstek.dorado.data.config;

import java.util.Collections;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import com.bstek.dorado.core.el.ContextVarsInitializerRegister;
import com.bstek.dorado.core.resource.GlobalResourceBundleManager;
import com.bstek.dorado.core.resource.LocaleResolver;
import com.bstek.dorado.core.xml.XmlDocumentBuilder;
import com.bstek.dorado.data.config.definition.DataProviderDefinitionManager;
import com.bstek.dorado.data.config.definition.DataResolverDefinitionManager;
import com.bstek.dorado.data.config.definition.GlobalDataTypeDefinitionManager;
import com.bstek.dorado.data.config.xml.DataObjectParserDispatcher;
import com.bstek.dorado.data.entity.DefaultEntityProxyMethodInterceptorFactory;
import com.bstek.dorado.data.method.DefaultSystemOptionalParametersFactory;
import com.bstek.dorado.data.provider.filter.AdvanceFilterCriterionParser;
import com.bstek.dorado.data.provider.filter.DefaultFilterCriterionProcessor;
import com.bstek.dorado.data.provider.manager.DataProviderTypeRegister;
import com.bstek.dorado.data.provider.manager.DataProviderTypeRegistry;
import com.bstek.dorado.data.provider.manager.DefaultDataProviderManager;
import com.bstek.dorado.data.resolver.manager.DataResolverTypeRegister;
import com.bstek.dorado.data.resolver.manager.DataResolverTypeRegistry;
import com.bstek.dorado.data.resolver.manager.DefaultDataResolverManager;
import com.bstek.dorado.data.resource.DefaultModelResourceBundleManager;
import com.bstek.dorado.data.resource.ModelResourceManager;
import com.bstek.dorado.data.type.manager.DataTypeTypeRegister;
import com.bstek.dorado.data.type.manager.DataTypeTypeRegistry;
import com.bstek.dorado.data.type.manager.DefaultDataTypeManager;
import com.bstek.dorado.data.type.validator.DefaultValidatorTypeRegistry;
import com.bstek.dorado.data.type.validator.ValidatorTypeRegister;

@Configuration
@Import(DataXmlParserContextConfig.class)
public class DataContextConfig {

	// --- Helper methods for abstract bean definitions ---

	protected void initAbstractResourceManager(ModelResourceManager manager,
			GlobalResourceBundleManager globalResourceBundleManager, Locale defaultLocale,
			LocaleResolver localeResolver) {
		manager.setGlobalResourceBundleManager(globalResourceBundleManager);
		manager.setDefaultLocale(defaultLocale);
		manager.setLocaleResolver(localeResolver);
	}

	protected void initDataTypeTypeRegister(DataTypeTypeRegister register,
			DataTypeTypeRegistry dataTypeTypeRegistry, String type, String classType) {
		register.setDataTypeTypeRegistry(dataTypeTypeRegistry);
		register.setType(type);
		register.setClassType(classType);
	}

	protected void initDataProviderTypeRegister(DataProviderTypeRegister register,
			DataProviderTypeRegistry dataProviderTypeRegistry, String type, String classType) {
		register.setDataProviderTypeRegistry(dataProviderTypeRegistry);
		register.setType(type);
		register.setClassType(classType);
	}

	protected void initDataResolverTypeRegister(DataResolverTypeRegister register,
			DataResolverTypeRegistry dataResolverTypeRegistry, String type, String classType) {
		register.setDataResolverTypeRegistry(dataResolverTypeRegistry);
		register.setType(type);
		register.setClassType(classType);
	}

	protected void initValidatorTypeRegister(ValidatorTypeRegister register,
			com.bstek.dorado.data.type.validator.ValidatorTypeRegistry validatorTypeRegistry, String type,
			String classType) {
		register.setValidatorTypeRegistry(validatorTypeRegistry);
		register.setType(type);
		register.setClassType(classType);
	}

	protected void initDataConfigManagerTemplate(ConfigurableDataConfigManager manager,
			DefaultDataTypeManager dataTypeManager, DefaultDataProviderManager dataProviderManager,
			DefaultDataResolverManager dataResolverManager, XmlDocumentBuilder xmlDocumentBuilder,
			com.bstek.dorado.config.xml.XmlParser preloadDataDocumentElementParser,
			DataObjectParserDispatcher dataObjectParserDispatcher,
			GlobalDataTypeDefinitionManager dataTypeDefinitionManager,
			DataProviderDefinitionManager dataProviderDefinitionManager,
			DataResolverDefinitionManager dataResolverDefinitionManager,
			@Value("${data.config.autoReloadEnabled}") boolean autoReloadEnabled,
			@Value("${data.config.autoRecalculatePaths}") boolean autoRecalculatePaths,
			@Value("${data.config.validateThreadIntervalSeconds}") long validateThreadIntervalSeconds,
			@Value("${data.config.minResourceValidateSeconds}") long minResourceValidateSeconds,
			@Value("${data.config.recalcLocationsThreadIntervalSeconds}") long recalcLocationsThreadIntervalSeconds) {
		manager.setDataTypeManager(dataTypeManager);
		manager.setDataProviderManager(dataProviderManager);
		manager.setDataResolverManager(dataResolverManager);
		manager.setXmlDocumentBuilder(xmlDocumentBuilder);
		manager.setPreloadParser(preloadDataDocumentElementParser);
		manager.setDataObjectParserDispatcher(dataObjectParserDispatcher);
		manager.setDataTypeDefinitionManager(dataTypeDefinitionManager);
		manager.setDataProviderDefinitionManager(dataProviderDefinitionManager);
		manager.setDataResolverDefinitionManager(dataResolverDefinitionManager);
		manager.setAutoReloadEnabled(autoReloadEnabled);
		manager.setAutoRecalculatePaths(autoRecalculatePaths);
		manager.setValidateThreadIntervalSeconds(validateThreadIntervalSeconds);
		manager.setMinResourceValidateSeconds(minResourceValidateSeconds);
		manager.setRecalcLocationsThreadIntervalSeconds(recalcLocationsThreadIntervalSeconds);
		manager.setConfigLocations(
				Collections.singletonList("classpath:com/bstek/dorado/data/base-types.xml"));
	}

	// --- Startup Listeners ---

	@Bean
	public DataConfigEngineStartupListener dataConfigEngineStartupListener(
			@Qualifier("dorado.dataConfigManager") DataConfigManager dataConfigManager) {
		DataConfigEngineStartupListener listener = new DataConfigEngineStartupListener();
		listener.setOrder(1001);
		listener.setDataConfigManager(dataConfigManager);
		return listener;
	}

	@Bean
	public DataObjectAnnotationEngineStartupListener dataObjectAnnotationEngineStartupListener(
			@Qualifier("dorado.dataProviderDefinitionManager") DataProviderDefinitionManager dataProviderDefinitionManager,
			@Qualifier("dorado.dataResolverDefinitionManager") DataResolverDefinitionManager dataResolverDefinitionManager) {
		DataObjectAnnotationEngineStartupListener listener = new DataObjectAnnotationEngineStartupListener();
		listener.setOrder(1002);
		listener.setDataProviderDefinitionManager(dataProviderDefinitionManager);
		listener.setDataResolverDefinitionManager(dataResolverDefinitionManager);
		return listener;
	}

	@Bean
	public ContextVarsInitializerRegister dataProviderContextVarsInitializerRegister() {
		ContextVarsInitializerRegister register = new ContextVarsInitializerRegister();
		register.setContextInitializer(new DataProviderContextVarsInitializer());
		return register;
	}

	// --- DataType Definition & Management ---

	@Bean("dorado.dataTypeDefinitionManager")
	public GlobalDataTypeDefinitionManager dataTypeDefinitionManager() {
		return new GlobalDataTypeDefinitionManager();
	}

	@Bean("dorado.dataTypeManager")
	public DefaultDataTypeManager dataTypeManager(
			@Qualifier("dorado.dataTypeDefinitionManager") GlobalDataTypeDefinitionManager dataTypeDefinitionManager) {
		DefaultDataTypeManager manager = new DefaultDataTypeManager();
		manager.setDataTypeDefinitionManager(dataTypeDefinitionManager);
		return manager;
	}

	@Bean("dorado.dataTypeTypeRegistry")
	public DataTypeTypeRegistry dataTypeTypeRegistry() {
		DataTypeTypeRegistry registry = new DataTypeTypeRegistry();
		registry.setDefaultType("default");
		return registry;
	}

	@Bean
	public DataTypeTypeRegister defaultDataTypeTypeRegister(
			@Qualifier("dorado.dataTypeTypeRegistry") DataTypeTypeRegistry dataTypeTypeRegistry) {
		DataTypeTypeRegister register = new DataTypeTypeRegister();
		initDataTypeTypeRegister(register, dataTypeTypeRegistry, "default",
				"com.bstek.dorado.data.type.DefaultEntityDataType");
		return register;
	}

	// --- DataProvider Definition & Management ---

	@Bean("dorado.dataProviderDefinitionManager")
	public DataProviderDefinitionManager dataProviderDefinitionManager() {
		return new DataProviderDefinitionManager();
	}

	@Bean("dorado.dataProviderManager")
	public DefaultDataProviderManager dataProviderManager(
			@Qualifier("dorado.dataProviderDefinitionManager") DataProviderDefinitionManager dataProviderDefinitionManager) {
		DefaultDataProviderManager manager = new DefaultDataProviderManager();
		manager.setDataProviderDefinitionManager(dataProviderDefinitionManager);
		return manager;
	}

	@Bean("dorado.dataProviderTypeRegistry")
	public DataProviderTypeRegistry dataProviderTypeRegistry() {
		DataProviderTypeRegistry registry = new DataProviderTypeRegistry();
		registry.setDefaultType("direct");
		return registry;
	}

	@Bean
	public DataProviderTypeRegister defaultDataProviderTypeRegister(
			@Qualifier("dorado.dataProviderTypeRegistry") DataProviderTypeRegistry dataProviderTypeRegistry) {
		DataProviderTypeRegister register = new DataProviderTypeRegister();
		initDataProviderTypeRegister(register, dataProviderTypeRegistry, "direct",
				"com.bstek.dorado.data.provider.DirectDataProvider");
		return register;
	}

	// --- DataResolver Definition & Management ---

	@Bean("dorado.dataResolverDefinitionManager")
	public DataResolverDefinitionManager dataResolverDefinitionManager() {
		return new DataResolverDefinitionManager();
	}

	@Bean("dorado.dataResolverManager")
	public DefaultDataResolverManager dataResolverManager(
			@Qualifier("dorado.dataResolverDefinitionManager") DataResolverDefinitionManager dataResolverDefinitionManager) {
		DefaultDataResolverManager manager = new DefaultDataResolverManager();
		manager.setDataResolverDefinitionManager(dataResolverDefinitionManager);
		return manager;
	}

	@Bean("dorado.dataResolverTypeRegistry")
	public DataResolverTypeRegistry dataResolverTypeRegistry() {
		DataResolverTypeRegistry registry = new DataResolverTypeRegistry();
		registry.setDefaultType("direct");
		return registry;
	}

	@Bean
	public DataResolverTypeRegister defaultDataResolverTypeRegister(
			@Qualifier("dorado.dataResolverTypeRegistry") DataResolverTypeRegistry dataResolverTypeRegistry) {
		DataResolverTypeRegister register = new DataResolverTypeRegister();
		initDataResolverTypeRegister(register, dataResolverTypeRegistry, "direct",
				"com.bstek.dorado.data.resolver.DirectDataResolver");
		return register;
	}

	// --- Validator ---

	@Bean("dorado.validatorTypeRegistry")
	public DefaultValidatorTypeRegistry validatorTypeRegistry() {
		return new DefaultValidatorTypeRegistry();
	}

	// --- DataConfig Manager ---

	@Bean("dorado.dataConfigManager")
	public ConfigurableDataConfigManager dataConfigManager(
			@Qualifier("dorado.dataTypeManager") DefaultDataTypeManager dataTypeManager,
			@Qualifier("dorado.dataProviderManager") DefaultDataProviderManager dataProviderManager,
			@Qualifier("dorado.dataResolverManager") DefaultDataResolverManager dataResolverManager,
			@Qualifier("dorado.xmlDocumentBuilder") XmlDocumentBuilder xmlDocumentBuilder,
			@Qualifier("dorado.preloadDataDocumentElementParser") com.bstek.dorado.config.xml.XmlParser preloadDataDocumentElementParser,
			@Qualifier("dorado.dataObjectParserDispatcher") DataObjectParserDispatcher dataObjectParserDispatcher,
			@Qualifier("dorado.dataTypeDefinitionManager") GlobalDataTypeDefinitionManager dataTypeDefinitionManager,
			@Qualifier("dorado.dataProviderDefinitionManager") DataProviderDefinitionManager dataProviderDefinitionManager,
			@Qualifier("dorado.dataResolverDefinitionManager") DataResolverDefinitionManager dataResolverDefinitionManager,
			@Value("${data.config.autoReloadEnabled}") boolean autoReloadEnabled,
			@Value("${data.config.autoRecalculatePaths}") boolean autoRecalculatePaths,
			@Value("${data.config.validateThreadIntervalSeconds}") long validateThreadIntervalSeconds,
			@Value("${data.config.minResourceValidateSeconds}") long minResourceValidateSeconds,
			@Value("${data.config.recalcLocationsThreadIntervalSeconds}") long recalcLocationsThreadIntervalSeconds) {
		ConfigurableDataConfigManager manager = new ConfigurableDataConfigManager();
		initDataConfigManagerTemplate(manager, dataTypeManager, dataProviderManager, dataResolverManager,
				xmlDocumentBuilder, preloadDataDocumentElementParser, dataObjectParserDispatcher,
				dataTypeDefinitionManager, dataProviderDefinitionManager, dataResolverDefinitionManager,
				autoReloadEnabled, autoRecalculatePaths, validateThreadIntervalSeconds, minResourceValidateSeconds,
				recalcLocationsThreadIntervalSeconds);
		return manager;
	}

	@Bean("dorado.defaultDataConfigLoader")
	public DataConfigLoader defaultDataConfigLoader(
			@Qualifier("dorado.dataConfigManager") ConfigurableDataConfigManager dataConfigManager,
			@Value("${model.root}") String modelRoot) {
		DataConfigLoader loader = new DataConfigLoader();
		loader.setDataConfigManager(dataConfigManager);
		loader.setConfigLocation(modelRoot + "/*.model.xml");
		return loader;
	}

	// --- Other Beans ---

	@Bean("dorado.entityProxyMethodInterceptorFactory")
	public DefaultEntityProxyMethodInterceptorFactory entityProxyMethodInterceptorFactory() {
		return new DefaultEntityProxyMethodInterceptorFactory();
	}

	@Bean("dorado.filterCriterionParser")
	public AdvanceFilterCriterionParser filterCriterionParser() {
		AdvanceFilterCriterionParser parser = new AdvanceFilterCriterionParser();
		parser.setCriterionProcessors(Collections.singletonList(new DefaultFilterCriterionProcessor()));
		return parser;
	}

	@Bean("dorado.modelResourceBundleManager")
	public DefaultModelResourceBundleManager modelResourceBundleManager(
			@Qualifier("dorado.privateResourceCache") Cache privateResourceCache) {
		DefaultModelResourceBundleManager manager = new DefaultModelResourceBundleManager();
		manager.setCache(privateResourceCache);
		return manager;
	}

	@Bean("dorado.modelResourceManager")
	public ModelResourceManager modelResourceManager(
			@Qualifier("dorado.globalResourceBundleManager") GlobalResourceBundleManager globalResourceBundleManager,
			@Qualifier("dorado.defaultLocale") Locale defaultLocale,
			@Qualifier("dorado.localeResolver") LocaleResolver localeResolver,
			@Qualifier("dorado.modelResourceBundleManager") com.bstek.dorado.data.resource.ModelResourceBundleManager modelResourceBundleManager) {
		ModelResourceManager manager = new ModelResourceManager();
		initAbstractResourceManager(manager, globalResourceBundleManager, defaultLocale, localeResolver);
		manager.setModelResourceBundleManager(modelResourceBundleManager);
		return manager;
	}

	@Bean("dorado.systemOptionalParametersFactory")
	public DefaultSystemOptionalParametersFactory systemOptionalParametersFactory() {
		return new DefaultSystemOptionalParametersFactory();
	}
}
