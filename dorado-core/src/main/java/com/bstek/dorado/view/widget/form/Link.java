package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "Link", category = "Form", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.Link", shortTypeName = "Link")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class Link extends Label {

	private String href;

	private String target;

	public String getHref() {
		return href;
	}

	public void setHref(String href) {
		this.href = href;
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(String target) {
		this.target = target;
	}

}
