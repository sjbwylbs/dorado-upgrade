package com.bstek.dorado.view.widget.base.toolbar;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.view.annotation.Widget;

@Widget(category = "ToolBar")
@XmlNode(nodeName = "ToolBarLabel")
@ClientObject(prototype = "dorado.widget.toolbar.ToolBarLabel", shortTypeName = "Label")
public class Label extends com.bstek.dorado.view.widget.Control {

	private String text;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

}
