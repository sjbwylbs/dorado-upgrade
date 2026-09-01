package com.bstek.dorado.data.provider;

public class Order {

	private String property;

	private String propertyPath;

	private boolean desc;

	public Order() {
	}

	public Order(String property, boolean desc) {
		this.property = property;
		this.desc = desc;
	}

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	public void setDesc(boolean desc) {
		this.desc = desc;
	}

	public String getPropertyPath() {
		return propertyPath;
	}

	public void setPropertyPath(String propertyPath) {
		this.propertyPath = propertyPath;
	}

	public boolean isDesc() {
		return desc;
	}

}
