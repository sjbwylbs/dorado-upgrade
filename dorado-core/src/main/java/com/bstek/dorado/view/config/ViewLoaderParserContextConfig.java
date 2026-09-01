package com.bstek.dorado.view.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.config.xml.IgnoreParser;
import com.bstek.dorado.config.xml.StaticPropertyParser;
import com.bstek.dorado.core.el.ExpressionHandler;
import com.bstek.dorado.view.loader.PackagesConfigPackageParser;
import com.bstek.dorado.view.loader.PackagesConfigParser;
import com.bstek.dorado.view.loader.PackagesConfigPatternParser;

@Configuration
public class ViewLoaderParserContextConfig {

	@Bean("dorado.packagesConfigParser")
	public PackagesConfigParser packagesConfigParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.staticPropertyParser") StaticPropertyParser staticPropertyParser,
			@Qualifier("dorado.packagesConfigPatternParser") PackagesConfigPatternParser packagesConfigPatternParser,
			@Qualifier("dorado.packagesConfigPackageParser") PackagesConfigPackageParser packagesConfigPackageParser) {
		PackagesConfigParser parser = new PackagesConfigParser();
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("*", staticPropertyParser);
		parser.registerSubParser("Pattern", packagesConfigPatternParser);
		parser.registerSubParser("Package", packagesConfigPackageParser);
		return parser;
	}

	@Bean("dorado.packagesConfigPatternParser")
	public PackagesConfigPatternParser packagesConfigPatternParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.staticPropertyParser") StaticPropertyParser staticPropertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser) {
		PackagesConfigPatternParser parser = new PackagesConfigPatternParser();
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("*", staticPropertyParser);
		parser.registerPropertyParser("name", ignoreParser);
		return parser;
	}

	@Bean("dorado.packagesConfigPackageParser")
	public PackagesConfigPackageParser packagesConfigPackageParser(
			@Qualifier("dorado.expressionHandler") ExpressionHandler expressionHandler,
			@Qualifier("dorado.staticPropertyParser") StaticPropertyParser staticPropertyParser,
			@Qualifier("dorado.ignoreParser") IgnoreParser ignoreParser) {
		PackagesConfigPackageParser parser = new PackagesConfigPackageParser();
		parser.setExpressionHandler(expressionHandler);
		parser.registerPropertyParser("*", staticPropertyParser);
		parser.registerPropertyParser("name", ignoreParser);
		return parser;
	}
}
