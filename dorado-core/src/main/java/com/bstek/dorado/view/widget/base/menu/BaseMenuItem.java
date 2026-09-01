package com.bstek.dorado.view.widget.base.menu;

import java.util.Map;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.view.ClientEventSupportedElement;
import com.bstek.dorado.view.widget.RenderableElement;

@XmlNode(implTypes = "com.bstek.dorado.view.widget.base.menu.*")
public abstract class BaseMenuItem extends ClientEventSupportedElement implements RenderableElement {

	private String name;

	private String width;

	private String height;

	private String className;

	private String exClassName;

	private Map<String, Object> style;

	private boolean visible = true;

	private String tip;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
