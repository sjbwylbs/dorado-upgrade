package com.bstek.dorado.view.manager;

import com.bstek.dorado.data.config.definition.DataCreationContext;

public class ViewCreationContext extends DataCreationContext {

	private ViewConfig viewConfig;

	public ViewConfig getViewConfig() {
		return viewConfig;
	}

	public void setViewConfig(ViewConfig viewConfig) {
		this.viewConfig = viewConfig;
	}

}
