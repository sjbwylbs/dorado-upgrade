package com.bstek.dorado.idesupport;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.config.xml.IgnoreParser;
import com.bstek.dorado.config.xml.StaticPropertyParser;
import com.bstek.dorado.config.xml.StringArrayPropertyParser;
import com.bstek.dorado.core.el.ExpressionHandler;
import com.bstek.dorado.core.xml.XmlDocumentBuilder;
import com.bstek.dorado.idesupport.parse.ChildTemplateParser;
import com.bstek.dorado.idesupport.parse.ClientEventParser;
import com.bstek.dorado.idesupport.parse.PreloadParser;
import com.bstek.dorado.idesupport.parse.PropertyParser;
import com.bstek.dorado.idesupport.parse.RuleTemplateParser;

@Configuration
public class IdeCommonContextConfig {

	/**
	 * Helper to initialize a ConfigurableDispatchableXmlParser-based idesupport parser
	 * with the expressionHandler (equivalent to parent dispatchableXmlParser).
	 */
	protected void initIdeParser(com.bstek.dorado.config.xml.ConfigurableDispatchableXmlParser parser,
			ExpressionHandler expressionHandler) {
		parser.setExpressionHandler(expressionHandler);
	}

	@Bean("dorado.idesupport.ruleTemplateParser")
	public RuleTemplateParser ruleTemplateParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.staticPropertyParser") StaticPropertyParser staticPropertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.stringArrayPropertyParser") StringArrayPropertyParser stringArrayPropertyParser,
			@Qualifier("dorado.idesupport.propertyTemplateParser") PropertyParser propertyTemplateParser,
			@Qualifier("dorado.idesupport.clientEventTemplateParser") ClientEventParser clientEventTemplateParser,
			@Qualifier("dorado.idesupport.childTemplateParser") ChildTemplateParser childTemplateParser) {
		RuleTemplateParser parser = new RuleTemplateParser();
		initIdeParser(parser, expressionHandler);
		parser.registerPropertyParser("*", staticPropertyParser);
		parser.registerPropertyParser("name", ignoreParser);
		parser.registerPropertyParser("parents,robots", stringArrayPropertyParser);
		parser.registerSubParser("Prop", propertyTemplateParser);
		parser.registerSubParser("ClientEvent", clientEventTemplateParser);
		parser.registerSubParser("Child", childTemplateParser);
		// 反向装配：打破与 childTemplateParser 的循环依赖（规则模板的 Child 子节点又要解析规则模板）
		childTemplateParser.setRuleTemplateParser(parser);
		return parser;
	}

	@Bean("dorado.idesupport.globalRuleTemplateParser")
	public RuleTemplateParser globalRuleTemplateParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.staticPropertyParser") StaticPropertyParser staticPropertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser,
			@Qualifier("dorado.stringArrayPropertyParser") StringArrayPropertyParser stringArrayPropertyParser,
			@Qualifier("dorado.idesupport.propertyTemplateParser") PropertyParser propertyTemplateParser,
			@Qualifier("dorado.idesupport.clientEventTemplateParser") ClientEventParser clientEventTemplateParser,
			@Qualifier("dorado.idesupport.childTemplateParser") ChildTemplateParser childTemplateParser) {
		RuleTemplateParser parser = new RuleTemplateParser();
		initIdeParser(parser, expressionHandler);
		parser.registerPropertyParser("*", staticPropertyParser);
		parser.registerPropertyParser("name", ignoreParser);
		parser.registerPropertyParser("parents,robots", stringArrayPropertyParser);
		parser.registerSubParser("Prop", propertyTemplateParser);
		parser.registerSubParser("ClientEvent", clientEventTemplateParser);
		parser.registerSubParser("Child", childTemplateParser);
		// 反向装配：打破与 childTemplateParser 的循环依赖
		childTemplateParser.setGlobalRuleTemplateParser(parser);
		parser.setGlobal(true);
		return parser;
	}

	@Bean("dorado.idesupport.propertyTemplateParser")
	public PropertyParser propertyTemplateParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.staticPropertyParser") StaticPropertyParser staticPropertyParser,
			@Qualifier("dorado.stringArrayPropertyParser") StringArrayPropertyParser stringArrayPropertyParser) {
		PropertyParser parser = new PropertyParser();
		initIdeParser(parser, expressionHandler);
		parser.registerPropertyParser("*", staticPropertyParser);
		parser.registerPropertyParser("enumValues", stringArrayPropertyParser);
		// Self-reference: register after bean creation (Spring proxy handles this)
		parser.registerSubParser("Prop", parser);
		return parser;
	}

	@Bean("dorado.idesupport.clientEventTemplateParser")
	public ClientEventParser clientEventTemplateParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.staticPropertyParser") StaticPropertyParser staticPropertyParser,
			@Qualifier("dorado.stringArrayPropertyParser") StringArrayPropertyParser stringArrayPropertyParser) {
		ClientEventParser parser = new ClientEventParser();
		initIdeParser(parser, expressionHandler);
		parser.registerPropertyParser("*", staticPropertyParser);
		parser.registerPropertyParser("parameters", stringArrayPropertyParser);
		return parser;
	}

	@Bean("dorado.idesupport.childTemplateParser")
	public ChildTemplateParser childTemplateParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.staticPropertyParser") StaticPropertyParser staticPropertyParser) {
		// ruleTemplateParser / globalRuleTemplateParser 与本 bean 互相引用，为避免循环依赖，
		// 此处不注入，改由两个 rule 解析器的 @Bean 方法创建时反向 set 进来
		ChildTemplateParser parser = new ChildTemplateParser();
		initIdeParser(parser, expressionHandler);
		parser.registerPropertyParser("*", staticPropertyParser);
		return parser;
	}

	@Bean("dorado.idesupport.ruleSetBuilder")
	public RuleSetBuilder ruleSetBuilder(
			@Qualifier("dorado.xmlDocumentBuilder") XmlDocumentBuilder xmlDocumentBuilder,
			@Qualifier("dorado.idesupport.globalRuleTemplateParser") RuleTemplateParser globalRuleTemplateParser) {
		RuleSetBuilder bean = new RuleSetBuilder();
		bean.setXmlDocumentBuilder(xmlDocumentBuilder);
		bean.setPreloadParser(new PreloadParser());
		bean.setRuleTemplateParser(globalRuleTemplateParser);
		return bean;
	}

}
