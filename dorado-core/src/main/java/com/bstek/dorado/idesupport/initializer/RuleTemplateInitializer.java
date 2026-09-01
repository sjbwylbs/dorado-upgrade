package com.bstek.dorado.idesupport.initializer;

import com.bstek.dorado.idesupport.template.RuleTemplate;

public interface RuleTemplateInitializer {

	public void initRuleTemplate(RuleTemplate ruleTemplate, InitializerContext initializerContext) throws Exception;

}
