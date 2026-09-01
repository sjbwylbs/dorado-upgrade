package com.bstek.dorado.view.widget.tree;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;

import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.view.View;
import com.bstek.dorado.view.ViewElement;
import com.bstek.dorado.view.ViewElementUtils;

@XmlNode
public class Node extends BaseNode implements ViewElement {

	private String id;

	private ViewElement parent;

	private View view;

	private Map<String, Object> metaData;

	private Collection<ViewElement> innerElements;

	/**
	 * 设置组件的id。
	 */
	@Override
	public void setId(String id) {
		if (view != null) {
			throw new IllegalStateException("Can not change the id property after the component attach to a view.");
		}
		this.id = id;
	}

	/**
	 * 返回组件的id。
	 */
	@Override
	@XmlProperty(attributeOnly = true)
	@IdeProperty(highlight = 1)
	public String getId() {
		return id;
	}

	/**
	 * 返回控件的父控件，即控件所属的容器。
	 */
	@Override
	@XmlProperty(unsupported = true)
	@IdeProperty(visible = false)
	public ViewElement getParent() {
		return parent;
	}

	/**
	 * 设置控件的父控件，即控件所属的容器。
	 */
	@Override
	public void setParent(ViewElement parent) {
		ViewElementUtils.clearParentViewElement(this, this.parent);
		this.parent = parent;
		ViewElementUtils.setParentViewElement(this, parent);
	}

	@Override
	@XmlProperty(unsupported = true)
	public View getView() {
		return view;
	}

	@XmlProperty(composite = true)
	public Map<String, Object> getMetaData() {
		return metaData;
	}

	public void setMetaData(Map<String, Object> metaData) {
		this.metaData = metaData;
	}

	@Override
	public void registerInnerElement(ViewElement element) {
		if (innerElements == null) {
			innerElements = new HashSet<>();
		}
		innerElements.add(element);
	}

	@Override
	public void unregisterInnerElement(ViewElement element) {
		if (innerElements != null) {
			innerElements.remove(element);
		}
	}

	@Override
	public Collection<ViewElement> getInnerElements() {
		return innerElements;
	}

}
