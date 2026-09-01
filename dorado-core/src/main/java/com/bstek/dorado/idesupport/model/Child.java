package com.bstek.dorado.idesupport.model;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

public class Child {

	private String name;

	private String property;

	private Rule rule;

	private Set<Rule> concreteRules = new TreeSet<>(new Comparator<Rule>() {
		@Override
		public int compare(Rule rule1, Rule rule2) {
			int result = rule1.getSortFactor() - rule2.getSortFactor();
			if (result == 0) {
				result = rule1.getName().compareTo(rule2.getName());
			}
			return result;
		}

	});

	private boolean fixed;

	private boolean aggregated;

	private int clientTypes;

	private boolean deprecated;

	private String reserve;

	private Object userData;

	public Child(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	public void setRule(Rule rule) {
		this.rule = rule;
	}

	public Rule getRule() {
		return rule;
	}

	public Set<Rule> getConcreteRules() {
		return concreteRules;
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

	public int getClientTypes() {
		return clientTypes;
	}

	public void setClientTypes(int clientTypes) {
		this.clientTypes = clientTypes;
	}

	public boolean isDeprecated() {
		return deprecated;
	}

	public void setDeprecated(boolean deprecated) {
		this.deprecated = deprecated;
	}

	public String getReserve() {
		return reserve;
	}

	public void setReserve(String reserve) {
		this.reserve = reserve;
	}

	public Object getUserData() {
		return userData;
	}

	public void setUserData(Object userData) {
		this.userData = userData;
	}

}
