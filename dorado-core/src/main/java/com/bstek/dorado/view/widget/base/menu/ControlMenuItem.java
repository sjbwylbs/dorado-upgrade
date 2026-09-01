package com.bstek.dorado.view.widget.base.menu;

import java.util.Collection;
import java.util.HashSet;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.ViewElement;
import com.bstek.dorado.view.widget.Control;
import com.bstek.dorado.view.widget.FloatControl;
import com.bstek.dorado.view.widget.InnerElementReference;

@ClientObject(prototype = "dorado.widget.menu.ControlMenuItem", shortTypeName = "Control")
@XmlNode(clientTypes = ClientType.DESKTOP)
public class ControlMenuItem extends TextMenuItem implements ViewElement {

	private InnerElementReference<Control> controlRef = new InnerElementReference<>(this);

	private Collection<ViewElement> innerElements = new HashSet<>();

	@XmlSubNode
	@ClientProperty
	public FloatControl getControl() {
		return (FloatControl) controlRef.get();
	}

	public void setControl(FloatControl control) {
		controlRef.set((Control) control);
	}

	@Override
	public void registerInnerElement(ViewElement element) {
		innerElements.add(element);
	}

	@Override
	public void unregisterInnerElement(ViewElement element) {
		innerElements.remove(element);
	}

	@Override
	public Collection<ViewElement> getInnerElements() {
		return innerElements;
	}

}
