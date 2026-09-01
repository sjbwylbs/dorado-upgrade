package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.datacontrol.AbstractPropertyDataControl;

@Widget(name = "DataMessage", category = "Form", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.DataMessage", shortTypeName = "DataMessage")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class DataMessage extends AbstractPropertyDataControl {

	private boolean showIconOnly;

	private boolean showMultiMessage;

	public boolean isShowIconOnly() {
		return showIconOnly;
	}

	public void setShowIconOnly(boolean showIconOnly) {
		this.showIconOnly = showIconOnly;
	}

	public boolean isShowMultiMessage() {
		return showMultiMessage;
	}

	public void setShowMultiMessage(boolean showMultiMessage) {
		this.showMultiMessage = showMultiMessage;
	}

}
