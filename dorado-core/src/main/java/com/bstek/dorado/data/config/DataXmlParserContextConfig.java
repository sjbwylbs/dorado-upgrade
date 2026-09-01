package com.bstek.dorado.data.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;

import com.bstek.dorado.config.xml.ConfigurableDispatchableXmlParser;
import com.bstek.dorado.config.xml.IgnoreParser;
import com.bstek.dorado.config.xml.PropertyParser;
import com.bstek.dorado.config.xml.XmlParser;
import com.bstek.dorado.config.xml.XmlParserHelper;
import com.bstek.dorado.core.el.ExpressionHandler;
import com.bstek.dorado.data.config.xml.DataCollectionParser;
import com.bstek.dorado.data.config.xml.DataElementParser;
import com.bstek.dorado.data.config.xml.DataObjectParseHelper;
import com.bstek.dorado.data.config.xml.DataObjectParserDispatcher;
import com.bstek.dorado.data.config.xml.DataProviderParser;
import com.bstek.dorado.data.config.xml.DataProviderParserDispatcher;
import com.bstek.dorado.data.config.xml.DataResolverParser;
import com.bstek.dorado.data.config.xml.DataResolverParserDispatcher;
import com.bstek.dorado.data.config.xml.DataTypeParser;
import com.bstek.dorado.data.config.xml.DataTypeParserDispatcher;
import com.bstek.dorado.data.config.xml.DataTypePropertyParser;
import com.bstek.dorado.data.config.xml.EntityParser;
import com.bstek.dorado.data.config.xml.GenericObjectParser;
import com.bstek.dorado.data.config.xml.GenericParser;
import com.bstek.dorado.data.config.xml.MapValuesParser;
import com.bstek.dorado.data.config.xml.PreloadDataProviderParser;
import com.bstek.dorado.data.config.xml.PreloadDataResolverParser;
import com.bstek.dorado.data.config.xml.PreloadDataTypeParser;
import com.bstek.dorado.data.config.xml.PropertyDefParser;
import com.bstek.dorado.data.config.xml.ReferenceParser;
import com.bstek.dorado.data.config.xml.StaticPropertyParser;
import com.bstek.dorado.data.config.xml.ValidatorParserDispatcher;
import com.bstek.dorado.data.config.xml.ValueParser;
import com.bstek.dorado.data.provider.manager.DataProviderTypeRegistry;
import com.bstek.dorado.data.resolver.manager.DataResolverTypeRegistry;
import com.bstek.dorado.data.type.manager.DataTypeTypeRegistry;
import com.bstek.dorado.data.type.validator.ValidatorTypeRegistry;

@Configuration
public class DataXmlParserContextConfig {

	// --- Helper methods for abstract bean definitions ---

	protected void initGenericParser(GenericParser parser, ExpressionHandler expressionHandler,
			DataObjectParseHelper dataObjectParseHelper) {
		parser.setExpressionHandler(expressionHandler);
		parser.setDataObjectParseHelper(dataObjectParseHelper);
	}

	protected void initGenericObjectParser(GenericObjectParser parser, ExpressionHandler expressionHandler,
			PropertyParser propertyParser, IgnoreParser ignoreParser, DataObjectParseHelper dataObjectParseHelper) {
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("*", propertyParser);
		parser.registerPropertyParser("impl,resource,meta", ignoreParser);
		parser.setDataObjectParseHelper(dataObjectParseHelper);
	}

	// --- Preload XML Parser ---

	@Bean("dorado.preloadDataDocumentElementParser")
	public ConfigurableDispatchableXmlParser preloadDataDocumentElementParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		ConfigurableDispatchableXmlParser parser = new ConfigurableDispatchableXmlParser();
		parser.setExpressionHandler(expressionHandler);

		PreloadDataTypeParser preloadDataTypeParser = new PreloadDataTypeParser();
		preloadDataTypeParser.setExpressionHandler(expressionHandler);
		parser.registerSubParser("DataType", preloadDataTypeParser);

		PreloadDataProviderParser preloadDataProviderParser = new PreloadDataProviderParser();
		preloadDataProviderParser.setExpressionHandler(expressionHandler);
		parser.registerSubParser("DataProvider", preloadDataProviderParser);

		PreloadDataResolverParser preloadDataResolverParser = new PreloadDataResolverParser();
		preloadDataResolverParser.setExpressionHandler(expressionHandler);
		parser.registerSubParser("DataResolver", preloadDataResolverParser);

		return parser;
	}

	@Bean("dorado.dataObjectParseHelper")
	public DataObjectParseHelper dataObjectParseHelper(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Lazy @Qualifier("dorado.dataTypeParserDispatcher") XmlParser dataTypeParserDispatcher) {
		DataObjectParseHelper helper = new DataObjectParseHelper();
		helper.setExpressionHandler(expressionHandler);
		helper.setDataTypeParser(dataTypeParserDispatcher);
		return helper;
	}

	// --- Data Parser ---

	@Bean("dorado.genericObjectParser")
	public GenericObjectParser genericObjectParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		GenericObjectParser parser = new GenericObjectParser();
		initGenericObjectParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.prototype.genericObjectParser")
	@Scope("prototype")
	public GenericObjectParser prototypeGenericObjectParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		GenericObjectParser parser = new GenericObjectParser();
		initGenericObjectParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.dataParser")
	public DataElementParser dataParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.listParser") XmlParser listParser,
			@Qualifier("dorado.setParser") XmlParser setParser,
			@Qualifier("dorado.entityParser") XmlParser entityParser,
			@Qualifier("dorado.valueParser") XmlParser valueParser) {
		DataElementParser parser = new DataElementParser();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.registerSubParser("List,Collection", listParser);
		parser.registerSubParser("Set", setParser);
		parser.registerSubParser("Entity", entityParser);
		parser.registerSubParser("Value", valueParser);
		return parser;
	}

	@Bean("dorado.dataCollectionParser")
	public DataCollectionParser dataCollectionParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.entityParser") XmlParser entityParser,
			@Qualifier("dorado.valueParser") XmlParser valueParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser) {
		DataCollectionParser parser = new DataCollectionParser();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.registerSubParser("Entity", entityParser);
		parser.registerSubParser("Value", valueParser);
		parser.registerPropertyParser("dataType", ignoreParser);
		return parser;
	}

	@Bean("dorado.listParser")
	public DataCollectionParser listParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.entityParser") XmlParser entityParser,
			@Qualifier("dorado.valueParser") XmlParser valueParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser) throws ClassNotFoundException {
		DataCollectionParser parser = new DataCollectionParser();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.registerSubParser("Entity", entityParser);
		parser.registerSubParser("Value", valueParser);
		parser.registerPropertyParser("dataType", ignoreParser);
		parser.setDefaultCollectionType("java.util.ArrayList");
		return parser;
	}

	@Bean("dorado.setParser")
	public DataCollectionParser setParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.entityParser") XmlParser entityParser,
			@Qualifier("dorado.valueParser") XmlParser valueParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser) throws ClassNotFoundException {
		DataCollectionParser parser = new DataCollectionParser();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.registerSubParser("Entity", entityParser);
		parser.registerSubParser("Value", valueParser);
		parser.registerPropertyParser("dataType", ignoreParser);
		parser.setDefaultCollectionType("java.util.HashSet");
		return parser;
	}

	@Bean("dorado.entityParser")
	public EntityParser entityParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			// @Lazy 打断 entityParser -> dataPropertyParser -> listParser/entityParser 的循环依赖，
			// 子解析器仅在运行期 XML 解析时调度，代理注入安全
			@Lazy @Qualifier("dorado.dataPropertyParser") XmlParser dataPropertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser) {
		EntityParser parser = new EntityParser();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.registerPropertyParser("*", dataPropertyParser);
		parser.registerPropertyParser("dataType", ignoreParser);
		return parser;
	}

	@Bean("dorado.valueParser")
	public ValueParser valueParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser) {
		ValueParser parser = new ValueParser();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.registerPropertyParser("dataType", ignoreParser);
		return parser;
	}

	@Bean("dorado.dataPropertyParser")
	public DataElementParser dataPropertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.listParser") XmlParser listParser,
			@Qualifier("dorado.setParser") XmlParser setParser,
			@Qualifier("dorado.entityParser") XmlParser entityParser,
			@Qualifier("dorado.valueParser") XmlParser valueParser) {
		DataElementParser parser = new DataElementParser();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.registerSubParser("List,Collection", listParser);
		parser.registerSubParser("Set", setParser);
		parser.registerSubParser("Entity", entityParser);
		parser.registerSubParser("Value", valueParser);
		return parser;
	}

	@Bean("dorado.staticDataPropertyParser")
	public StaticPropertyParser staticDataPropertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		StaticPropertyParser parser = new StaticPropertyParser();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.dataObjectParserDispatcher")
	public DataObjectParserDispatcher dataObjectParserDispatcher(
			@Qualifier("dorado.dataTypeParserDispatcher") XmlParser dataTypeParserDispatcher,
			@Qualifier("dorado.dataProviderParserDispatcher") XmlParser dataProviderParserDispatcher,
			@Qualifier("dorado.dataResolverParserDispatcher") XmlParser dataResolverParserDispatcher) {
		DataObjectParserDispatcher dispatcher = new DataObjectParserDispatcher();
		dispatcher.setDataTypeParser((com.bstek.dorado.config.xml.DispatchableXmlParser) dataTypeParserDispatcher);
		dispatcher.setDataProviderParser((com.bstek.dorado.config.xml.DispatchableXmlParser) dataProviderParserDispatcher);
		dispatcher.setDataResolverParser((com.bstek.dorado.config.xml.DispatchableXmlParser) dataResolverParserDispatcher);
		return dispatcher;
	}

	// --- DataType Parser ---

	@Bean("dorado.dataTypeParserDispatcher")
	public DataTypeParserDispatcher dataTypeParserDispatcher(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.dataTypeTypeRegistry") DataTypeTypeRegistry dataTypeTypeRegistry,
			@Qualifier("dorado.xmlParserHelper") XmlParserHelper xmlParserHelper) {
		DataTypeParserDispatcher parser = new DataTypeParserDispatcher();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.setDataTypeTypeRegistry(dataTypeTypeRegistry);
		parser.setXmlParserHelper(xmlParserHelper);
		return parser;
	}

	@Bean("dorado.prototype.dataTypeParser")
	@Scope("prototype")
	public DataTypeParser prototypeDataTypeParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		DataTypeParser parser = new DataTypeParser();
		initGenericObjectParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		parser.setInheritable(true);
		parser.registerPropertyParser("elementDataType", ignoreParser);
		return parser;
	}

	@Bean("dorado.propertyDefParser")
	@Scope("prototype")
	public PropertyDefParser propertyDefParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		PropertyDefParser parser = new PropertyDefParser();
		initGenericObjectParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.referenceParser")
	@Scope("prototype")
	public ReferenceParser referenceParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		ReferenceParser parser = new ReferenceParser();
		initGenericObjectParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.dataTypePropertyParser")
	public DataTypePropertyParser dataTypePropertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		DataTypePropertyParser parser = new DataTypePropertyParser();
		parser.setExpressionHandler(expressionHandler);
		parser.setDataObjectParseHelper(dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.mapValuesParser")
	public MapValuesParser mapValuesParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.listParser") XmlParser listParser,
			@Qualifier("dorado.setParser") XmlParser setParser,
			@Qualifier("dorado.entityParser") XmlParser entityParser,
			@Qualifier("dorado.valueParser") XmlParser valueParser) {
		MapValuesParser parser = new MapValuesParser();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.registerSubParser("List,Collection", listParser);
		parser.registerSubParser("Set", setParser);
		parser.registerSubParser("Entity", entityParser);
		parser.registerSubParser("Value", valueParser);
		return parser;
	}

	// --- Validator Parser ---

	@Bean("dorado.validatorParserDispatcher")
	public ValidatorParserDispatcher validatorParserDispatcher(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.xmlParserHelper") XmlParserHelper xmlParserHelper,
			@Qualifier("dorado.validatorTypeRegistry") ValidatorTypeRegistry validatorTypeRegistry) {
		ValidatorParserDispatcher parser = new ValidatorParserDispatcher();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.setXmlParserHelper(xmlParserHelper);
		parser.setValidatorTypeRegistry(validatorTypeRegistry);
		return parser;
	}

	// --- DataProvider Parser ---

	@Bean("dorado.dataProviderParserDispatcher")
	public DataProviderParserDispatcher dataProviderParserDispatcher(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.dataProviderTypeRegistry") DataProviderTypeRegistry dataProviderTypeRegistry,
			@Qualifier("dorado.xmlParserHelper") XmlParserHelper xmlParserHelper) {
		DataProviderParserDispatcher parser = new DataProviderParserDispatcher();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.setDataProviderTypeRegistry(dataProviderTypeRegistry);
		parser.setXmlParserHelper(xmlParserHelper);
		return parser;
	}

	@Bean("dorado.prototype.dataProviderParser")
	@Scope("prototype")
	public DataProviderParser prototypeDataProviderParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		DataProviderParser parser = new DataProviderParser();
		initGenericObjectParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}

	// --- DataResolver Parser ---

	@Bean("dorado.dataResolverParserDispatcher")
	public DataResolverParserDispatcher dataResolverParserDispatcher(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.dataResolverTypeRegistry") DataResolverTypeRegistry dataResolverTypeRegistry,
			@Qualifier("dorado.xmlParserHelper") XmlParserHelper xmlParserHelper) {
		DataResolverParserDispatcher parser = new DataResolverParserDispatcher();
		initGenericParser(parser, expressionHandler, dataObjectParseHelper);
		parser.setDataResolverTypeRegistry(dataResolverTypeRegistry);
		parser.setXmlParserHelper(xmlParserHelper);
		return parser;
	}

	@Bean("dorado.prototype.dataResolverParser")
	@Scope("prototype")
	public DataResolverParser prototypeDataResolverParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		DataResolverParser parser = new DataResolverParser();
		initGenericObjectParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}
}
