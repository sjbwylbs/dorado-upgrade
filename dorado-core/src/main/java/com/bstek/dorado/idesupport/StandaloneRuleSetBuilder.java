package com.bstek.dorado.idesupport;

import java.io.InputStream;

import com.bstek.dorado.core.CommonContext;
import com.bstek.dorado.core.Configure;
import com.bstek.dorado.core.ConfigureStore;
import com.bstek.dorado.core.Context;
import com.bstek.dorado.idesupport.model.RuleSet;

public abstract class StandaloneRuleSetBuilder {

	private final static String CONFIG_LOCATIONS = "com.bstek.dorado.core.CoreContextConfig,"
			+ "com.bstek.dorado.config.TextParserContextConfig,"
			+ "com.bstek.dorado.config.XmlParserContextConfig,"
			+ "com.bstek.dorado.idesupport.IdeCommonContextConfig";

	private static RuleSetBuilder getRuleSetBuilder() throws Exception {
		Context context = Context.getCurrent();
		return (RuleSetBuilder) context.getServiceBean("idesupport.ruleSetBuilder");
	}

	public static RuleSet getRuleSet(InputStream in) throws Exception {
		ConfigureStore configureStore = Configure.getStore();
		configureStore.set("core.contextConfigLocation", CONFIG_LOCATIONS);
		CommonContext.init();
		try {
			return getRuleSetBuilder().buildRuleSet(in);
		}
		finally {
			CommonContext.dispose();
		}
	}

}
