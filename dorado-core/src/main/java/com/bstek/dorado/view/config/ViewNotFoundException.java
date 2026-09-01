package com.bstek.dorado.view.config;

import java.io.IOException;

import com.bstek.dorado.core.io.Resource;
import com.bstek.dorado.core.resource.ResourceManager;
import com.bstek.dorado.core.resource.ResourceManagerUtils;

public class ViewNotFoundException extends IOException {

	private static final long serialVersionUID = -7007869262081740176L;

	private static final ResourceManager resourceManager = ResourceManagerUtils.get(ViewNotFoundException.class);

	private String viewName;

	private Resource resource;

	public ViewNotFoundException(String viewName, Resource resource) {
		super(resourceManager.getString("dorado.common/viewNotFoundError", viewName, resource.getPath()));
		this.viewName = viewName;
		this.resource = resource;
	}

	public String getViewName() {
		return viewName;
	}

	public Resource getResource() {
		return resource;
	}

}
