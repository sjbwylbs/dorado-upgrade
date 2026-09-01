package com.bstek.dorado.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.config.text.ConfigurableDispatchableTextParser;
import com.bstek.dorado.config.text.ConfigutableTextAttributeParser;
import com.bstek.dorado.config.text.TextParserHelper;
import com.bstek.dorado.core.el.ExpressionHandler;

@Configuration
public class TextParserContextConfig {

	@Bean("dorado.dispatchableTextParser")
	public ConfigurableDispatchableTextParser dispatchableTextParser(
			@Qualifier("dorado.textAttributeParser") ConfigutableTextAttributeParser textAttributeParser) {
		ConfigurableDispatchableTextParser parser = new ConfigurableDispatchableTextParser();
		parser.registerAttributeParser("*", textAttributeParser);
		return parser;
	}

	@Bean("dorado.textAttributeParser")
	public ConfigutableTextAttributeParser textAttributeParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler) {
		ConfigutableTextAttributeParser parser = new ConfigutableTextAttributeParser();
		parser.setExpressionHandler(expressionHandler);
		return parser;
	}

	@Bean("dorado.textParserHelper")
	public TextParserHelper textParserHelper() {
		return new TextParserHelper();
	}
}
