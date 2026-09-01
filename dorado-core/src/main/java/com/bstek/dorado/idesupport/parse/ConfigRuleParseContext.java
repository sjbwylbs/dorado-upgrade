package com.bstek.dorado.idesupport.parse;

import java.util.LinkedHashMap;
import java.util.Map;

import org.w3c.dom.Element;

import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.idesupport.RuleTemplateManager;
import com.bstek.dorado.idesupport.template.RuleTemplate;

public class ConfigRuleParseContext extends ParseContext {

	private Map<String, Element> ruleElementMap = new LinkedHashMap<>();

	private Map<String, RuleTemplate> ruleTemplateMap = new LinkedHashMap<>();

	private RuleTemplateManager ruleTemplateManager;

	public Map<String, Element> getRuleElementMap() {
		return ruleElementMap;
	}

	public Map<String, RuleTemplate> getRuleTemplateMap() {
		return ruleTemplateMap;
	}

	public RuleTemplateManager getRuleTemplateManager() {
		return ruleTemplateManager;
	}

	public void setRuleTemplateManager(RuleTemplateManager ruleTemplateManager) {
		this.ruleTemplateManager = ruleTemplateManager;
	}

}
