package com.bstek.dorado.idesupport.template;

import com.bstek.dorado.annotation.XmlSubNode;

public class AutoChildTemplate extends ChildTemplate {

	private XmlSubNode xmlSubNode;

	public AutoChildTemplate(String name, RuleTemplate ruleTemplate, XmlSubNode xmlSubNode) {
		super(name, ruleTemplate);
		this.xmlSubNode = xmlSubNode;
	}

	public XmlSubNode getXmlSubNode() {
		return xmlSubNode;
	}

}
