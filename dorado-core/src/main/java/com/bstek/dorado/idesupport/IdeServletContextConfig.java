package com.bstek.dorado.idesupport;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.idesupport.output.ComputedRuleSetJsonOutputter;
import com.bstek.dorado.idesupport.output.RuleSetXmlOutputter;
import com.bstek.dorado.idesupport.resolver.ComputedRuleSetJsonResolver;
import com.bstek.dorado.idesupport.resolver.RuleSetXmlResolver;
import com.bstek.dorado.web.resolver.ResolverRegister;
import com.bstek.dorado.web.resolver.ResolverRegisterProcessor;

@Configuration
public class IdeServletContextConfig {

	@Bean("dorado.idesupport.configRulesXmlResolverRegister")
	public ResolverRegister configRulesXmlResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.idesupport.ruleTemplateBuilder") RuleTemplateBuilder ruleTemplateBuilder,
			@Qualifier("dorado.idesupport.ruleSetXmlOutputter") RuleSetXmlOutputter ruleSetXmlOutputter) {
		ResolverRegister bean = new ResolverRegister();
		bean.setResolverRegisterProcessor(resolverRegisterProcessor);
		bean.setUrl("/dorado/ide/config-rules.xml");

		RuleSetXmlResolver resolver = new RuleSetXmlResolver();
		resolver.setRuleTemplateBuilder(ruleTemplateBuilder);
		resolver.setRuleSetOutputter(ruleSetXmlOutputter);
		bean.setResolver(resolver);
		return bean;
	}

	@Bean("dorado.idesupport.computedConfigRulesJsonResolverRegister")
	public ResolverRegister computedConfigRulesJsonResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.idesupport.ruleTemplateBuilder") RuleTemplateBuilder ruleTemplateBuilder,
			@Qualifier("dorado.idesupport.ruleSetBuilder") RuleSetBuilder ruleSetBuilder,
			@Qualifier("dorado.idesupport.computedRuleSetJsonOutputter") ComputedRuleSetJsonOutputter computedRuleSetJsonOutputter) {
		ResolverRegister bean = new ResolverRegister();
		bean.setResolverRegisterProcessor(resolverRegisterProcessor);
		bean.setUrl("/dorado/ide/computed-config-rules.json");

		ComputedRuleSetJsonResolver resolver = new ComputedRuleSetJsonResolver();
		resolver.setRuleTemplateBuilder(ruleTemplateBuilder);
		resolver.setRuleSetBuilder(ruleSetBuilder);
		resolver.setRuleSetOutputter(computedRuleSetJsonOutputter);
		bean.setResolver(resolver);
		return bean;
	}

}
