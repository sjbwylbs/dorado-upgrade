package com.bstek.dorado.view.widget.base;

import com.bstek.dorado.annotation.ClientEvent;
import com.bstek.dorado.annotation.ClientEvents;
import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNodeWrapper;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.Control;
import com.bstek.dorado.view.widget.Direction;
import com.bstek.dorado.view.widget.InnerElementReference;

@Widget(name = "SplitPanel", category = "General", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.SplitPanel", shortTypeName = "SplitPanel")
@ClientEvents({ @ClientEvent(name = "beforeCollapsedChange"), @ClientEvent(name = "onCollapsedChange") })
public class SplitPanel extends Control {

	private Direction direction = Direction.left;

	private InnerElementReference<Control> sideControlRef = new InnerElementReference<>(this);

	private InnerElementReference<Control> mainControlRef = new InnerElementReference<>(this);

	private String position = "100";

	private int minPosition;

	private int maxPosition;

	private boolean resizeable = true;

	private boolean collapsed;

	private boolean collapseable = true;

	private boolean previewable;

	private boolean collapseBothSide = false;

	private boolean openPreviewOnHover = false;

	private Boolean animate;

	@ClientProperty(escapeValue = "left")
	@IdeProperty(highlight = 1)
	public Direction getDirection() {
		return direction;
	}

	public void setDirection(Direction direction) {
		this.direction = direction;
	}

	@XmlSubNode(wrapper = @XmlNodeWrapper(nodeName = "SideControl",
			icon = "/com/bstek/dorado/view/widget/base/SideControl.png"))
	@ClientProperty
	public Control getSideControl() {
		return sideControlRef.get();
	}

	public void setSideControl(Control sideControl) {
		sideControlRef.set(sideControl);
	}

	@XmlSubNode(wrapper = @XmlNodeWrapper(nodeName = "MainControl",
			icon = "/com/bstek/dorado/view/widget/base/MainControl.png"))
	@ClientProperty
	public Control getMainControl() {
		return mainControlRef.get();
	}

	public void setMainControl(Control mainControl) {
		mainControlRef.set(mainControl);
	}

	@ClientProperty(escapeValue = "100")
	@IdeProperty(highlight = 1)
	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public int getMinPosition() {
		return minPosition;
	}

	public void setMinPosition(int minPosition) {
		this.minPosition = minPosition;
	}

	public int getMaxPosition() {
		return maxPosition;
	}

	public void setMaxPosition(int maxPosition) {
		this.maxPosition = maxPosition;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isResizeable() {
		return resizeable;
	}

	public void setResizeable(boolean resizeable) {
		this.resizeable = resizeable;
	}

	public boolean isCollapsed() {
		return collapsed;
	}

	public void setCollapsed(boolean collapsed) {
		this.collapsed = collapsed;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isCollapseable() {
		return collapseable;
	}

	public void setCollapseable(boolean collapsable) {
		this.collapseable = collapsable;
	}

	public boolean isPreviewable() {
		return previewable;
	}

	public void setPreviewable(boolean previewable) {
		this.previewable = previewable;
	}

	@ClientProperty(escapeValue = "false")
	public boolean isCollapseBothSide() {
		return collapseBothSide;
	}

	public void setCollapseBothSide(boolean collapseBothSide) {
		this.collapseBothSide = collapseBothSide;
	}

	@ClientProperty(escapeValue = "false")
	public boolean isOpenPreviewOnHover() {
		return openPreviewOnHover;
	}

	public void setOpenPreviewOnHover(boolean openPreviewOnHover) {
		this.openPreviewOnHover = openPreviewOnHover;
	}

	public Boolean getAnimate() {
		return animate;
	}

	public void setAnimate(Boolean animate) {
		this.animate = animate;
	}

}
