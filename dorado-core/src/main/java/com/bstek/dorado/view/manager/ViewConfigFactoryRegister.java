package com.bstek.dorado.view.manager;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.Ordered;

import com.bstek.dorado.spring.RemovableBean;
import com.bstek.dorado.util.Assert;

public class ViewConfigFactoryRegister implements InitializingBean, Ordered, RemovableBean {

	private ViewConfigManager viewConfigManager;

	private String viewNamePattern;

	private Object viewConfigFactory;

	private int order = 999;

	public void setViewConfigManager(ViewConfigManager viewConfigManager) {
		this.viewConfigManager = viewConfigManager;
	}

	public void setViewNamePattern(String viewNamePattern) {
		this.viewNamePattern = viewNamePattern;
	}

	public void setViewConfigFactory(Object viewConfigFactory) {
		this.viewConfigFactory = viewConfigFactory;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notEmpty(viewNamePattern);
		Assert.notNull(viewConfigFactory);
		viewConfigManager.registerViewConfigFactory(viewNamePattern, viewConfigFactory);
	}

	@Override
	public int getOrder() {
		return order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

}
