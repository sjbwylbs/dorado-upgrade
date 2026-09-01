package com.bstek.dorado.view.widget.base.tab;

import java.util.Map;

import com.bstek.dorado.annotation.ClientEvent;
import com.bstek.dorado.annotation.ClientEvents;
import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.common.Namable;
import com.bstek.dorado.view.ClientEventSupportedElement;
import com.bstek.dorado.view.widget.RenderableElement;

@XmlNode(isPublic = false)
@ClientObject(prototype = "dorado.widget.tab.Tab", shortTypeName = "Tab")
@ClientEvents({ @ClientEvent(name = "beforeClose"), @ClientEvent(name = "onClose"), @ClientEvent(name = "onClick") })
public class Tab extends ClientEventSupportedElement implements RenderableElement, Namable {

	private String name;

	private String caption;

	private boolean closeable;

	private String icon;

	private String iconClass;

	private boolean disabled;

	private String width;

	private String height;

	private String className;

	@Deprecated
	private String exClassName;

	private Map<String, Object> style;

	private boolean visible = true;

	private String tip;

	@Override
	public String getName() {
		return name;
	}

	@Override
	public void setName(String name) {
		this.name = name;
	}

	@IdeProperty(highlight = 1)
	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	public boolean isCloseable() {
		return closeable;
	}

	public void setCloseable(boolean closeable) {
		this.closeable = closeable;
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

	public boolean isDisabled() {
		return disabled;
	}

	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
	}

	@Override
	public String getWidth() {
		return width;
	}

	@Override
	public void setWidth(String width) {
		this.width = width;
	}

	@Override
	public String getHeight() {
		return height;
	}

	@Override
	public void setHeight(String height) {
		this.height = height;
	}

	@Override
	public String getClassName() {
		return className;
	}

	@Override
	public void setClassName(String className) {
		this.className = className;
	}

	@Deprecated
	@XmlProperty(deprecated = true)
	public String getExClassName() {
		return exClassName;
	}

	@Deprecated
	public void setExClassName(String exClassName) {
		this.exClassName = exClassName;
	}

	@Override
	@XmlProperty(composite = true)
	public Map<String, Object> getStyle() {
		return style;
	}

	@Override
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

	public String getTip() {
		return tip;
	}

	public void setTip(String tip) {
		this.tip = tip;
	}

}
