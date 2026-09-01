package com.bstek.dorado.console.web;

public class DoradoObject {

	private String name;

	private String bean;

	private String method;

	private Type type;

	public enum Type {

		ExposedService, DataType, DataProvider, DataResolver, ViewConfig

	}

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

	public String getTypeName() {
		return type.name();
	}

	public void setType(Type type) {
		this.type = type;
	}

}
