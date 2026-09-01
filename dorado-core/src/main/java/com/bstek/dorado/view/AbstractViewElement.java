package com.bstek.dorado.view;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.common.Ignorable;
import com.bstek.dorado.common.MetaDataSupport;
import com.bstek.dorado.common.TagSupport;

public abstract class AbstractViewElement
		implements ViewElement, TagSupport, Ignorable, UserDataSupport, MetaDataSupport {

	private String id;

	private ViewElement parent;

	private View view;

	private String tags;

	private boolean ignored;

	private Object userData;

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

	/**
	 * 返回用于保存自定义信息的对象。
	 */
	@Override
	public String getTags() {
		return tags;
	}

	/**
	 * 设置用于保存自定义信息的对象。
	 */
	@Override
	public void setTags(String tags) {
		this.tags = tags;
	}

	@Override
	@ClientProperty(ignored = true)
	public boolean isIgnored() {
		return ignored;
	}

	@Override
	public void setIgnored(boolean ignored) {
		this.ignored = ignored;
	}

	@Override
	@XmlProperty
	@ClientProperty
	public Object getUserData() {
		return userData;
	}

	@Override
	public void setUserData(Object userData) {
		this.userData = userData;
	}

	@Override
	@XmlProperty(composite = true)
	public Map<String, Object> getMetaData() {
		return metaData;
	}

	@Override
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