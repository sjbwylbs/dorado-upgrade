package com.bstek.dorado.view.widget.base.accordion;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import com.bstek.dorado.annotation.ClientEvents;
import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.common.event.ClientEvent;
import com.bstek.dorado.common.event.ClientEventHolder;
import com.bstek.dorado.view.ClientEventSupportedElement;
import com.bstek.dorado.view.ViewElement;
import com.bstek.dorado.view.widget.Control;
import com.bstek.dorado.view.widget.InnerElementReference;

@XmlNode
@ClientObject(prototype = "dorado.widget.accordion.Section", shortTypeName = "Section")
@ClientEvents({ @com.bstek.dorado.annotation.ClientEvent(name = "onCaptionClick") })
public class Section extends ClientEventSupportedElement {

	private String name;

	private String caption;

	private String icon;

	private String iconClass;

	private String className;

	private String exClassName;

	private Map<String, Object> style;

	private boolean visible = true;

	private boolean disabled;

	private String tip;

	private InnerElementReference<Control> controlRef = new InnerElementReference<>(this);

	private Collection<ViewElement> innerElements = new HashSet<>();

	private ClientEventHolder clientEventHolder = new ClientEventHolder(this);

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getIconClass() {
		return iconClass;
	}

	public void setIconClass(String iconClass) {
		this.iconClass = iconClass;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getExClassName() {
		return exClassName;
	}

	public void setExClassName(String exClassName) {
		this.exClassName = exClassName;
	}

	@XmlProperty(composite = true)
	public Map<String, Object> getStyle() {
		return style;
	}

	public void setStyle(Map<String, Object> style) {
		this.style = style;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}

	public boolean isDisabled() {
		return disabled;
	}

	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
	}

	public String getTip() {
		return tip;
	}

	public void setTip(String tip) {
		this.tip = tip;
	}

	@Override
	public void addClientEventListener(String eventName, ClientEvent eventListener) {
		clientEventHolder.addClientEventListener(eventName, eventListener);
	}

	@Override
	public List<ClientEvent> getClientEventListeners(String eventName) {
		return clientEventHolder.getClientEventListeners(eventName);
	}

	@Override
	public void clearClientEventListeners(String eventName) {
		clientEventHolder.clearClientEventListeners(eventName);
	}

	@Override
	public Map<String, List<ClientEvent>> getAllClientEventListeners() {
		return clientEventHolder.getAllClientEventListeners();
	}

	@XmlSubNode
	@ClientProperty
	public Control getControl() {
		return controlRef.get();
	}

	public void setControl(Control control) {
		controlRef.set(control);
	}

}
