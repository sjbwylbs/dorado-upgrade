package com.bstek.dorado.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.bstek.dorado.common.event.ClientEventParser;
import com.bstek.dorado.config.text.TextParserHelper;
import com.bstek.dorado.config.xml.ClassTypePropertyParser;
import com.bstek.dorado.config.xml.CollectionToPropertyParser;
import com.bstek.dorado.config.xml.CompositePropertyParser;
import com.bstek.dorado.config.xml.ConfigurableDispatchableXmlParser;
import com.bstek.dorado.config.xml.IgnoreParser;
import com.bstek.dorado.config.xml.ObjectParser;
import com.bstek.dorado.config.xml.ObjectParsersInitializer;
import com.bstek.dorado.config.xml.PropertyParser;
import com.bstek.dorado.config.xml.StaticPropertyParser;
import com.bstek.dorado.config.xml.StringArrayPropertyParser;
import com.bstek.dorado.config.xml.SubNodeToPropertyParser;
import com.bstek.dorado.config.xml.TextPropertyParser;
import com.bstek.dorado.config.xml.UnsupportParser;
import com.bstek.dorado.config.xml.XmlParserHelper;
import com.bstek.dorado.core.el.ExpressionHandler;

@Configuration
public class XmlParserContextConfig {

	// --- Helper methods for abstract bean definitions ---

	protected void initDispatchableXmlParser(ConfigurableDispatchableXmlParser parser,
			ExpressionHandler expressionHandler) {
		parser.setExpressionHandler(expressionHandler);
	}

	protected void initObjectParser(ObjectParser parser, ExpressionHandler expressionHandler,
			PropertyParser propertyParser, IgnoreParser ignoreParser) {
		initDispatchableXmlParser(parser, expressionHandler);
		parser.registerPropertyParser("*", propertyParser);
		parser.registerPropertyParser("impl,resource,meta", ignoreParser);
	}

	protected void initCompositePropertyParser(CompositePropertyParser parser,
			ExpressionHandler expressionHandler, PropertyParser propertyParser, IgnoreParser ignoreParser) {
		initObjectParser(parser, expressionHandler, propertyParser, ignoreParser);
		parser.setDefaultPropertyParser(propertyParser);
	}

	protected void initTextPropertyParser(TextPropertyParser parser, ExpressionHandler expressionHandler) {
		parser.setExpressionHandler(expressionHandler);
	}

	// --- Concrete beans ---

	@Bean("dorado.ignoreParser")
	public IgnoreParser ignoreParser() {
		return new IgnoreParser();
	}

	@Bean("dorado.unsupportParser")
	public UnsupportParser unsupportParser() {
		return new UnsupportParser();
	}

	@Bean("dorado.propertyParser")
	public PropertyParser propertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		PropertyParser parser = new PropertyParser();
		initDispatchableXmlParser(parser, expressionHandler);
		return parser;
	}

	@Bean("dorado.staticPropertyParser")
	public StaticPropertyParser staticPropertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		StaticPropertyParser parser = new StaticPropertyParser();
		initDispatchableXmlParser(parser, expressionHandler);
		return parser;
	}

	@Bean("dorado.stringArrayPropertyParser")
	public StringArrayPropertyParser stringArrayPropertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		StringArrayPropertyParser parser = new StringArrayPropertyParser();
		initDispatchableXmlParser(parser, expressionHandler);
		return parser;
	}

	@Bean("dorado.classTypePropertyParser")
	public ClassTypePropertyParser classTypePropertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		ClassTypePropertyParser parser = new ClassTypePropertyParser();
		initDispatchableXmlParser(parser, expressionHandler);
		return parser;
	}

	// --- Prototype beans (abstract parents have no @Bean) ---

	@Bean("dorado.prototype.textPropertyParser")
	@Scope("prototype")
	public TextPropertyParser prototypeTextPropertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		TextPropertyParser parser = new TextPropertyParser();
		initTextPropertyParser(parser, expressionHandler);
		return parser;
	}

	@Bean("dorado.prototype.objectParser")
	@Scope("prototype")
	public ObjectParser prototypeObjectParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser) {
		ObjectParser parser = new ObjectParser();
		initObjectParser(parser, expressionHandler, propertyParser, ignoreParser);
		return parser;
	}

	@Bean("dorado.prototype.compositePropertyParser")
	@Scope("prototype")
	public CompositePropertyParser prototypeCompositePropertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser) {
		CompositePropertyParser parser = new CompositePropertyParser();
		initCompositePropertyParser(parser, expressionHandler, propertyParser, ignoreParser);
		return parser;
	}

	@Bean("dorado.prototype.collectionToPropertyParser")
	@Scope("prototype")
	public CollectionToPropertyParser prototypeCollectionToPropertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		CollectionToPropertyParser parser = new CollectionToPropertyParser();
		initDispatchableXmlParser(parser, expressionHandler);
		return parser;
	}

	@Bean("dorado.prototype.subNodeToPropertyParser")
	@Scope("prototype")
	public SubNodeToPropertyParser prototypeSubNodeToPropertyParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		SubNodeToPropertyParser parser = new SubNodeToPropertyParser();
		initDispatchableXmlParser(parser, expressionHandler);
		return parser;
	}

	// --- ClientEventParser (concrete, parent=dispatchableXmlParser) ---

	@Bean("dorado.clientEventParser")
	public ClientEventParser clientEventParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		ClientEventParser parser = new ClientEventParser();
		initDispatchableXmlParser(parser, expressionHandler);
		return parser;
	}

	// --- Helper beans ---

	@Bean("dorado.xmlParserHelper")
	public XmlParserHelper xmlParserHelper(
			@Qualifier("dorado.textParserHelper") TextParserHelper textParserHelper) {
		XmlParserHelper helper = new XmlParserHelper();
		helper.setTextParserHelper(textParserHelper);
		return helper;
	}

	@Bean
	public ObjectParsersInitializer objectParsersInitializer(
			@Qualifier("dorado.xmlParserHelper") XmlParserHelper xmlParserHelper) {
		ObjectParsersInitializer initializer = new ObjectParsersInitializer();
		initializer.setXmlParserHelper(xmlParserHelper);
		return initializer;
	}
}
