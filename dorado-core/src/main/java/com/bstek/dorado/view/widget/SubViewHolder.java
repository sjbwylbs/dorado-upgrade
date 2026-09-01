package com.bstek.dorado.view.widget;

import java.util.Map;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "SubViewHolder", category = "General", dependsPackage = "widget")
@ClientObject(prototype = "dorado.widget.SubViewHolder", shortTypeName = "SubViewHolder",
		properties = @ClientProperty(propertyName = "subViewName",
				outputter = "spring:dorado.subViewNamePropertyOutputter"))
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class SubViewHolder extends Control implements HtmlElement {

	private String subView;

	private Map<String, Object> context;

	private SubViewLoadMode loadMode = SubViewLoadMode.preload;

	@ClientProperty(outputter = "spring:dorado.subViewPropertyOutputter")
	public String getSubView() {
		return subView;
	}

	public void setSubView(String subView) {
		this.subView = subView;
	}

	@XmlProperty(composite = true)
	public Map<String, Object> getContext() {
		return context;
	}

	public void setContext(Map<String, Object> context) {
		this.context = context;
	}

	public SubViewLoadMode getLoadMode() {
		return loadMode;
	}

	public void setLoadMode(SubViewLoadMode loadMode) {
		this.loadMode = loadMode;
	}

}
