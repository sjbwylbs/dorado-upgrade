package com.bstek.dorado.view.widget.base.tab;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.IdeProperty;

@ClientObject(prototype = "dorado.widget.tab.IFrameTab", shortTypeName = "IFrame")
public class IFrameTab extends Tab {

	private String path;

	private Integer iframeHeight;

	@IdeProperty(highlight = 1)
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Integer getIframeHeight() {
		return iframeHeight;
	}

	public void setIframeHeight(Integer iframeHeight) {
		this.iframeHeight = iframeHeight;
	}

}
