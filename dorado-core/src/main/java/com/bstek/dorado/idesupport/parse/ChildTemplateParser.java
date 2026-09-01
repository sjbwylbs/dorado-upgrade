package com.bstek.dorado.idesupport.parse;

import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.config.xml.ConfigurableDispatchableXmlParser;
import com.bstek.dorado.config.xml.XmlParseException;
import com.bstek.dorado.idesupport.template.ChildTemplate;
import com.bstek.dorado.idesupport.template.RuleTemplate;
import com.bstek.dorado.util.xml.DomUtils;

public class ChildTemplateParser extends ConfigurableDispatchableXmlParser {

	private RuleTemplateParser ruleTemplateParser;

	private RuleTemplateParser globalRuleTemplateParser;

	public void setRuleTemplateParser(RuleTemplateParser ruleTemplateParser) {
		this.ruleTemplateParser = ruleTemplateParser;
	}

	public void setGlobalRuleTemplateParser(RuleTemplateParser globalRuleTemplateParser) {
		this.globalRuleTemplateParser = globalRuleTemplateParser;
	}

	@Override
	protected Object doParse(Node node, ParseContext context) throws Exception {
		Element element = (Element) node;
		ConfigRuleParseContext parserContext = (ConfigRuleParseContext) context;

		Map<String, Object> properties = this.parseProperties(element, context);
		String name = (String) properties.remove("name");

		RuleTemplate ruleTemplate;
		String ruleName = (String) properties.remove("rule");
		if (StringUtils.isNotEmpty(ruleName)) {
			ruleTemplate = globalRuleTemplateParser.getRuleTemplate(ruleName, parserContext);
			if (ruleTemplate == null) {
				throw new XmlParseException("Unknown Rule [" + ruleName + "].", node, context);
			}
		}
		else {
			List<Element> childElements = DomUtils.getChildElements(element);
			if (childElements.size() == 1) {
				ruleTemplate = (RuleTemplate) ruleTemplateParser.parse(childElements.get(0), parserContext);
				ruleName = ruleTemplate.getNodeName();
				if (StringUtils.isEmpty(ruleName)) {
					ruleName = ruleTemplate.getName();
				}
			}
			else {
				throw new XmlParseException("Rule undefined.", element, context);
			}
		}
		properties.put("ruleTemplate", ruleTemplate);

		if (StringUtils.isEmpty(name)) {
			name = ruleName;
		}

		ChildTemplate child = new ChildTemplate(name);

		String clientTypesText = (String) properties.remove("clientTypes");
		int clientTypes = ClientType.parseClientTypes(clientTypesText);
		if (clientTypes > 0) {
			child.setClientTypes(clientTypes);
		}

		BeanUtils.copyProperties(child, properties);
		return child;
	}

}
