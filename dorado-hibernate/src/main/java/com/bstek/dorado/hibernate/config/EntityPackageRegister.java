package com.bstek.dorado.hibernate.config;

import com.bstek.dorado.spring.RemovableBean;

public class EntityPackageRegister implements RemovableBean {
	private String basePackage;

	public String getBasePackage() {
		return basePackage;
	}

	public void setBasePackage(String basePackage) {
		this.basePackage = basePackage;
	}
}
