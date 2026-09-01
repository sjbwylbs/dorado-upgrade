package com.bstek.dorado.view.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.bstek.dorado.config.text.ConfigurableDispatchableTextParser;
import com.bstek.dorado.config.text.ConfigutableTextAttributeParser;
import com.bstek.dorado.config.xml.CompositePropertyParser;
import com.bstek.dorado.config.xml.IgnoreParser;
import com.bstek.dorado.config.xml.PropertyParser;
import com.bstek.dorado.config.xml.TextPropertyParser;
import com.bstek.dorado.config.xml.XmlParser;
import com.bstek.dorado.config.xml.XmlParserHelper;
import com.bstek.dorado.core.el.ExpressionHandler;
import com.bstek.dorado.data.config.xml.DataObjectParseHelper;
import com.bstek.dorado.data.config.xml.DataObjectParserDispatcher;
import com.bstek.dorado.view.ViewParser;
import com.bstek.dorado.view.config.text.DefaultMapTextParserDispatcher;
import com.bstek.dorado.view.config.xml.ComponentParserDispatcher;
import com.bstek.dorado.view.config.xml.ContextParser;
import com.bstek.dorado.view.config.xml.ItemsParser;
import com.bstek.dorado.view.config.xml.ModelParser;
import com.bstek.dorado.view.config.xml.StylePropertyParser;
import com.bstek.dorado.view.config.xml.ViewArgumentsParser;
import com.bstek.dorado.view.config.xml.ViewConfigParser;
import com.bstek.dorado.view.config.xml.ViewXmlParserHelper;
import com.bstek.dorado.view.registry.ComponentTypeRegistry;
import com.bstek.dorado.view.registry.LayoutTypeRegistry;
import com.bstek.dorado.view.type.property.validator.AjaxValidatorParser;
import com.bstek.dorado.view.widget.ChildComponentParser;
import com.bstek.dorado.view.widget.ComponentParser;
import com.bstek.dorado.view.widget.ContainerParser;
import com.bstek.dorado.view.widget.ControlParser;
import com.bstek.dorado.view.widget.action.AjaxActionParser;
import com.bstek.dorado.view.widget.action.LongTaskParser;
import com.bstek.dorado.view.widget.action.UpdateActionParser;
import com.bstek.dorado.view.widget.data.DataSetParser;
import com.bstek.dorado.view.widget.layout.LayoutConstraintParser;
import com.bstek.dorado.view.widget.layout.LayoutConstraintParserDispatcher;
import com.bstek.dorado.view.widget.layout.LayoutParser;
import com.bstek.dorado.view.widget.layout.LayoutTextParserDispatcher;

@Configuration
public class ViewParserContextConfig {

	// --- Helper methods for abstract parent beans ---

	protected void initComponentParser(ComponentParser parser, ExpressionHandler expressionHandler,
			PropertyParser propertyParser, IgnoreParser ignoreParser, DataObjectParseHelper dataObjectParseHelper) {
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("*", propertyParser);
		parser.registerPropertyParser("impl,resource,meta", ignoreParser);
		parser.setDataObjectParseHelper(dataObjectParseHelper);
	}

	protected TextPropertyParser textPropertyParser(ExpressionHandler expressionHandler) {
		TextPropertyParser parser = new TextPropertyParser();
		parser.setExpressionHandler(expressionHandler);
		return parser;
	}

	protected CompositePropertyParser compositePropertyParser(ExpressionHandler expressionHandler,
			PropertyParser propertyParser, IgnoreParser ignoreParser) {
		CompositePropertyParser parser = new CompositePropertyParser();
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("*", propertyParser);
		parser.registerPropertyParser("impl,resource,meta", ignoreParser);
		parser.setDefaultPropertyParser(propertyParser);
		return parser;
	}

	// --- ViewXmlParserHelper (overrides core's dorado.xmlParserHelper) ---

	@Bean("dorado.xmlParserHelper")
	public ViewXmlParserHelper xmlParserHelper(
			@Qualifier("dorado.textParserHelper") com.bstek.dorado.config.text.TextParserHelper textParserHelper) {
		ViewXmlParserHelper helper = new ViewXmlParserHelper();
		helper.setTextParserHelper(textParserHelper);
		return helper;
	}

	// --- View Parsers ---

	@Bean("dorado.viewConfigParser")
	public ViewConfigParser viewConfigParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		ViewConfigParser parser = new ViewConfigParser();
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("*", propertyParser);
		parser.registerPropertyParser("impl,resource,meta", ignoreParser);
		parser.setDataObjectParseHelper(dataObjectParseHelper);
		parser.setImpl("com.bstek.dorado.view.manager.ViewConfig");
		return parser;
	}

	@Bean("dorado.viewArgumentsParser")
	public ViewArgumentsParser viewArgumentsParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.staticPropertyParser") com.bstek.dorado.config.xml.StaticPropertyParser staticPropertyParser) {
		ViewArgumentsParser parser = new ViewArgumentsParser();
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("name", ignoreParser);
		parser.registerPropertyParser("value", staticPropertyParser);
		return parser;
	}

	@Bean("dorado.viewContextParser")
	public ContextParser viewContextParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser) {
		ContextParser parser = new ContextParser();
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("name", ignoreParser);
		parser.registerPropertyParser("value", propertyParser);
		return parser;
	}

	@Bean("dorado.viewModelParser")
	public ModelParser viewModelParser(
			@Qualifier("dorado.preloadDataDocumentElementParser") XmlParser preloadDataDocumentElementParser,
			@Qualifier("dorado.dataObjectParserDispatcher") DataObjectParserDispatcher dataObjectParserDispatcher) {
		ModelParser parser = new ModelParser();
		parser.setDataObjectPreloadParser(preloadDataDocumentElementParser);
		parser.setDataObjectParserDispatcher(dataObjectParserDispatcher);
		return parser;
	}

	// --- Layout Parsers ---

	@Bean("dorado.layoutTextParser")
	public LayoutParser layoutTextParser(
			@Qualifier("dorado.textAttributeParser") ConfigutableTextAttributeParser textAttributeParser) {
		LayoutParser parser = new LayoutParser();
		parser.registerAttributeParser("*", textAttributeParser);
		return parser;
	}

	@Bean("dorado.layoutParser")
	public DefaultMapTextParserDispatcher layoutParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.layoutTypeRegistry") LayoutTypeRegistry layoutTypeRegistry,
			@Qualifier("dorado.textParserHelper") com.bstek.dorado.config.text.TextParserHelper textParserHelper) {
		DefaultMapTextParserDispatcher parser = new DefaultMapTextParserDispatcher();
		parser.setExpressionHandler(expressionHandler);
		LayoutTextParserDispatcher layoutTextParserDispatcher = new LayoutTextParserDispatcher();
		layoutTextParserDispatcher.setLayoutTypeRegistry(layoutTypeRegistry);
		layoutTextParserDispatcher.setTextParserHelper(textParserHelper);
		parser.setTextParser(layoutTextParserDispatcher);
		return parser;
	}

	@Bean("dorado.layoutConstraintParser")
	public LayoutConstraintParserDispatcher layoutConstraintParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		LayoutConstraintParserDispatcher parser = new LayoutConstraintParserDispatcher();
		parser.setExpressionHandler(expressionHandler);
		LayoutConstraintParser layoutConstraintParser = new LayoutConstraintParser();
		parser.setTextParser(layoutConstraintParser);
		return parser;
	}

	// --- Style Parsers ---

	@Bean("dorado.styleTextParser")
	public ConfigurableDispatchableTextParser styleTextParser(
			@Qualifier("dorado.textAttributeParser") ConfigutableTextAttributeParser textAttributeParser) {
		ConfigurableDispatchableTextParser parser = new ConfigurableDispatchableTextParser();
		parser.registerAttributeParser("*", textAttributeParser);
		return parser;
	}

	@Bean("dorado.styleParser")
	public StylePropertyParser styleParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.styleTextParser") ConfigurableDispatchableTextParser styleTextParser) {
		StylePropertyParser parser = new StylePropertyParser();
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("*", propertyParser);
		parser.registerPropertyParser("impl,resource,meta", ignoreParser);
		parser.setDefaultPropertyParser(propertyParser);
		parser.setOpen(true);
		parser.setTextParser(styleTextParser);
		return parser;
	}

	// --- Items Parser ---

	@Bean("dorado.itemsParser")
	public ItemsParser itemsParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.listParser") XmlParser listParser,
			@Qualifier("dorado.setParser") XmlParser setParser,
			@Qualifier("dorado.entityParser") XmlParser entityParser,
			@Qualifier("dorado.valueParser") XmlParser valueParser) {
		ItemsParser parser = new ItemsParser();
		parser.setExpressionHandler(expressionHandler);
		parser.setDataObjectParseHelper(dataObjectParseHelper);
		parser.registerSubParser("List,Collection", listParser);
		parser.registerSubParser("Set", setParser);
		parser.registerSubParser("Entity", entityParser);
		parser.registerSubParser("Value", valueParser);
		return parser;
	}

	// --- Component Parser Chain (prototype) ---

	@Bean("dorado.componentParser")
	@Scope("prototype")
	public ComponentParser componentParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		ComponentParser parser = new ComponentParser();
		initComponentParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.controlParser")
	@Scope("prototype")
	public ControlParser controlParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		ControlParser parser = new ControlParser();
		initComponentParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.containerParser")
	@Scope("prototype")
	public ContainerParser containerParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.layoutTypeRegistry") LayoutTypeRegistry layoutTypeRegistry,
			@Qualifier("dorado.layoutParser") XmlParser layoutParser) {
		ContainerParser parser = new ContainerParser();
		initComponentParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		parser.setLayoutTypeRegistry(layoutTypeRegistry);
		parser.setLayoutParser(layoutParser);
		parser.registerPropertyParser("layout", ignoreParser);
		return parser;
	}

	@Bean("dorado.viewParser")
	@Scope("prototype")
	public ViewParser viewParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper,
			@Qualifier("dorado.layoutTypeRegistry") LayoutTypeRegistry layoutTypeRegistry,
			@Qualifier("dorado.layoutParser") XmlParser layoutParser) {
		ViewParser parser = new ViewParser();
		initComponentParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		parser.setLayoutTypeRegistry(layoutTypeRegistry);
		parser.setLayoutParser(layoutParser);
		parser.registerPropertyParser("layout", ignoreParser);
		return parser;
	}

	// --- Component Parser Dispatcher & Child Parser ---

	@Bean("dorado.componentParserDispatcher")
	public ComponentParserDispatcher componentParserDispatcher(
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry componentTypeRegistry,
			@Qualifier("dorado.xmlParserHelper") XmlParserHelper xmlParserHelper) {
		ComponentParserDispatcher dispatcher = new ComponentParserDispatcher();
		dispatcher.setComponentTypeRegistry(componentTypeRegistry);
		dispatcher.setXmlParserHelper(xmlParserHelper);
		return dispatcher;
	}

	@Bean("dorado.childComponentParser")
	public ChildComponentParser childComponentParser(
			@Qualifier("dorado.componentParserDispatcher") ComponentParserDispatcher componentParserDispatcher) {
		ChildComponentParser parser = new ChildComponentParser();
		parser.setComponentParser(componentParserDispatcher);
		return parser;
	}

	// --- Specialized Component Parsers (prototype, parent=componentParser) ---

	@Bean("dorado.dataSetParser")
	@Scope("prototype")
	public DataSetParser dataSetParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		DataSetParser parser = new DataSetParser();
		initComponentParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		parser.registerPropertyParser("dataProvider,dataType", ignoreParser);
		return parser;
	}

	@Bean("dorado.ajaxActionParser")
	@Scope("prototype")
	public AjaxActionParser ajaxActionParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		AjaxActionParser parser = new AjaxActionParser();
		initComponentParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.ajaxValidatorParser")
	@Scope("prototype")
	public AjaxValidatorParser ajaxValidatorParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		AjaxValidatorParser parser = new AjaxValidatorParser();
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("*", propertyParser);
		parser.registerPropertyParser("impl,resource,meta", ignoreParser);
		parser.setDataObjectParseHelper(dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.updateActionParser")
	@Scope("prototype")
	public UpdateActionParser updateActionParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		UpdateActionParser parser = new UpdateActionParser();
		initComponentParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}

	@Bean("dorado.longTaskParser")
	@Scope("prototype")
	public LongTaskParser longTaskParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.propertyParser") PropertyParser propertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.dataObjectParseHelper") DataObjectParseHelper dataObjectParseHelper) {
		LongTaskParser parser = new LongTaskParser();
		initComponentParser(parser, expressionHandler, propertyParser, ignoreParser, dataObjectParseHelper);
		return parser;
	}
}
