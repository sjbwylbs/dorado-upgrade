package com.bstek.dorado.idesupport;

import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import com.bstek.dorado.core.xml.XmlDocumentBuilder;
import com.bstek.dorado.data.provider.manager.DataProviderTypeRegistry;
import com.bstek.dorado.data.resolver.manager.DataResolverTypeRegistry;
import com.bstek.dorado.data.type.manager.DataTypeTypeRegistry;
import com.bstek.dorado.data.type.validator.ValidatorTypeRegistry;
import com.bstek.dorado.idesupport.initializer.FloatControlRuleTemplateInitializer;
import com.bstek.dorado.idesupport.initializer.ModelRuleTemplateInitializer;
import com.bstek.dorado.idesupport.initializer.RuleTemplateInitializer;
import com.bstek.dorado.idesupport.initializer.ViewConfigRuleTemplateInitializer;
import com.bstek.dorado.idesupport.output.ComputedRuleSetJsonOutputter;
import com.bstek.dorado.idesupport.output.RuleSetXmlOutputter;
import com.bstek.dorado.idesupport.parse.PreloadParser;
import com.bstek.dorado.idesupport.parse.RuleTemplateParser;
import com.bstek.dorado.view.output.ClientOutputHelper;
import com.bstek.dorado.view.registry.ComponentTypeRegistry;
import com.bstek.dorado.view.registry.LayoutTypeRegistry;

@Configuration
@Import(IdeCommonContextConfig.class)
public class IdeContextConfig {

	@Bean("dorado.idesupport.ruleTemplateBuilder")
	public RuleTemplateBuilder ruleTemplateBuilder(
			@Qualifier("dorado.xmlDocumentBuilder") XmlDocumentBuilder xmlDocumentBuilder,
			@Qualifier("dorado.idesupport.globalRuleTemplateParser") RuleTemplateParser globalRuleTemplateParser,
			@Qualifier("dorado.dataTypeTypeRegistry") DataTypeTypeRegistry dataTypeTypeRegistry,
			@Qualifier("dorado.validatorTypeRegistry") ValidatorTypeRegistry validatorTypeRegistry,
			@Qualifier("dorado.dataProviderTypeRegistry") DataProviderTypeRegistry dataProviderTypeRegistry,
			@Qualifier("dorado.dataResolverTypeRegistry") DataResolverTypeRegistry dataResolverTypeRegistry,
			@Qualifier("dorado.layoutTypeRegistry") LayoutTypeRegistry layoutTypeRegistry,
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry componentTypeRegistry)
			throws ClassNotFoundException {

		RuleTemplateBuilder bean = new RuleTemplateBuilder();
		bean.setXmlDocumentBuilder(xmlDocumentBuilder);
		bean.setPreloadParser(new PreloadParser());
		bean.setRuleTemplateParser(globalRuleTemplateParser);
		bean.setConfigTemplateFiles(List.of(
				"com/bstek/dorado/idesupport/base-config-rules.xml",
				"com/bstek/dorado/idesupport/data-config-rules.xml",
				"com/bstek/dorado/idesupport/view-config-rules.xml",
				"com/bstek/dorado/idesupport/user-config-rules.xml"));

		// Build initializerMap
		LinkedHashMap<String, RuleTemplateInitializer> initializerMap = new LinkedHashMap<>();

		ModelRuleTemplateInitializer modelInitializer = new ModelRuleTemplateInitializer();
		modelInitializer.setDataTypeTypeRegistry(dataTypeTypeRegistry);
		modelInitializer.setValidatorTypeRegistry(validatorTypeRegistry);
		modelInitializer.setDataProviderTypeRegistry(dataProviderTypeRegistry);
		modelInitializer.setDataResolverTypeRegistry(dataResolverTypeRegistry);
		initializerMap.put("Model", modelInitializer);

		ViewConfigRuleTemplateInitializer viewConfigInitializer = new ViewConfigRuleTemplateInitializer();
		viewConfigInitializer.setLayoutTypeRegistry(layoutTypeRegistry);
		viewConfigInitializer.setComponentTypeRegistry(componentTypeRegistry);
		initializerMap.put("ViewConfig", viewConfigInitializer);

		initializerMap.put("classType:com.bstek.dorado.view.widget.FloatControl",
				new FloatControlRuleTemplateInitializer());

		bean.setInitializerMap(initializerMap);
		return bean;
	}

	/**
	 * Abstract bean definition helper for dorado.idesupport.ruleConfigLoader.
	 */
	protected RuleConfigLoader ruleConfigLoader(RuleTemplateBuilder ruleTemplateBuilder) {
		RuleConfigLoader bean = new RuleConfigLoader();
		bean.setRuleTemplateBuilder(ruleTemplateBuilder);
		return bean;
	}

	@Bean("dorado.idesupport.ruleSetXmlOutputter")
	public RuleSetXmlOutputter ruleSetXmlOutputter() {
		return new RuleSetXmlOutputter();
	}

	@Bean("dorado.idesupport.computedRuleSetJsonOutputter")
	public ComputedRuleSetJsonOutputter computedRuleSetJsonOutputter(
			@Qualifier("dorado.clientOutputHelper") ClientOutputHelper clientOutputHelper,
			@Qualifier("dorado.componentTypeRegistry") ComponentTypeRegistry componentTypeRegistry) {
		ComputedRuleSetJsonOutputter bean = new ComputedRuleSetJsonOutputter();
		bean.setClientOutputHelper(clientOutputHelper);
		bean.setComponentTypeRegistry(componentTypeRegistry);
		return bean;
	}

}
