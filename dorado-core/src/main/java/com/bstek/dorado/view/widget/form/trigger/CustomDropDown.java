package com.bstek.dorado.view.widget.form.trigger;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.Control;
import com.bstek.dorado.view.widget.InnerElementReference;

@Widget(name = "CustomDropDown", category = "Trigger", dependsPackage = "base-widget-desktop", autoGenerateId = true)
@ClientObject(prototype = "dorado.widget.CustomDropDown", shortTypeName = "CustomDropDown")
@XmlNode(clientTypes = ClientType.DESKTOP)
public class CustomDropDown extends DropDown {

	private InnerElementReference<Control> controlRef = new InnerElementReference<>(this);

	@XmlSubNode
	@ClientProperty
	public Control getControl() {
		return controlRef.get();
	}

	public void setControl(Control control) {
		controlRef.set(control);
	}

}
