package com.bstek.dorado.view.config;

import com.bstek.dorado.core.io.Resource;

public class ViewConfigInfo {

	private String viewName;

	private Resource resource;

	private Object configModel;

	public ViewConfigInfo(String viewName, Resource resource, Object configModel) {
		this.viewName = viewName;
		this.resource = resource;
		this.configModel = configModel;
	}

	public String getViewName() {
		return viewName;
	}

	public Resource getResource() {
		return resource;
	}

	public Object getConfigModel() {
		return configModel;
	}

}
