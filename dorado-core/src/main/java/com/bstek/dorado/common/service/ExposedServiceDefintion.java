package com.bstek.dorado.common.service;

public class ExposedServiceDefintion {

	private String name;

	private String bean;

	private String method;

	private Object exDefinition;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBean() {
		return bean;
	}

	public void setBean(String bean) {
		this.bean = bean;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public Object getExDefinition() {
		return exDefinition;
	}

	public void setExDefinition(Object exDefinition) {
		this.exDefinition = exDefinition;
	}

}
