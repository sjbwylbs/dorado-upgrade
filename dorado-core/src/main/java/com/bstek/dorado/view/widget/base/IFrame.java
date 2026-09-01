package com.bstek.dorado.view.widget.base;

import com.bstek.dorado.annotation.ClientEvent;
import com.bstek.dorado.annotation.ClientEvents;
import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.Control;

@Widget(name = "IFrame", category = "General", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.IFrame", shortTypeName = "IFrame")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
@ClientEvents({ @ClientEvent(name = "onLoad") })
public class IFrame extends Control {

	private String path;

	private String name;

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

}
