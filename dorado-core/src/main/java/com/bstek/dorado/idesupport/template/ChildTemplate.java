package com.bstek.dorado.idesupport.template;

import com.bstek.dorado.util.Assert;

public class ChildTemplate {

	private String name;

	private String property;

	private RuleTemplate ruleTemplate;

	private boolean fixed;

	private boolean aggregated;

	private boolean deprecated;

	private boolean visible = true;

	private boolean isPublic = true;

	private int clientTypes;

	private String reserve;

	public ChildTemplate(String name) {
		this.name = name;
		Assert.notEmpty(name);
	}

	public ChildTemplate(String name, RuleTemplate ruleTemplate) {
		this(name);
		this.ruleTemplate = ruleTemplate;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	public RuleTemplate getRuleTemplate() {
		return ruleTemplate;
	}

	public void setRuleTemplate(RuleTemplate ruleTemplate) {
		this.ruleTemplate = ruleTemplate;
	}

	public boolean isFixed() {
		return fixed;
	}

	public void setFixed(boolean fixed) {
		this.fixed = fixed;
	}

	public boolean isAggregated() {
		return aggregated;
	}

	public void setAggregated(boolean aggregated) {
		this.aggregated = aggregated;
	}

	public boolean isDeprecated() {
		return deprecated;
	}

	public void setDeprecated(boolean deprecated) {
		this.deprecated = deprecated;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}

	public boolean isPublic() {
		return isPublic;
	}

	public void setPublic(boolean isPublic) {
		this.isPublic = isPublic;
	}

	public int getClientTypes() {
		return clientTypes;
	}

	public void setClientTypes(int clientTypes) {
		this.clientTypes = clientTypes;
	}

	public String getReserve() {
		return reserve;
	}

	public void setReserve(String reserve) {
		this.reserve = reserve;
	}

}
