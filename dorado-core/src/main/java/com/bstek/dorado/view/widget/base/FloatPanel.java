package com.bstek.dorado.view.widget.base;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.FloatControl;
import com.bstek.dorado.view.widget.FloatControlAlign;
import com.bstek.dorado.view.widget.FloatControlAnimateType;
import com.bstek.dorado.view.widget.FloatControlShadowMode;
import com.bstek.dorado.view.widget.FloatControlVAlign;
import com.bstek.dorado.view.widget.ModalType;

@Widget(name = "FloatPanel", category = "Floatable", dependsPackage = "base-widget-desktop")
@ClientObject(prototype = "dorado.widget.FloatPanel", shortTypeName = "FloatPanel")
public class FloatPanel extends Panel implements FloatControl {

	private FloatControlAnimateType animateType = FloatControlAnimateType.zoom;

	private FloatControlAnimateType showAnimateType;

	private FloatControlAnimateType hideAnimateType;

	private String animateTarget;

	private boolean center;

	private boolean modal;

	private ModalType modalType = ModalType.dark;

	private FloatControlShadowMode shadowMode = FloatControlShadowMode.sides;

	private boolean focusAfterShow = true;

	private boolean continuedFocus = true;

	private boolean floating = true;

	private String floatingClassName;

	private int left;

	private int top;

	private int offsetLeft;

	private int offsetTop;

	private String anchorTarget;

	private FloatControlAlign align;

	private FloatControlVAlign vAlign;

	private boolean autoAdjustPosition = true;

	private boolean handleOverflow = true;

	public FloatPanel() {
		setVisible(null);
	}

	@Override
	public Boolean getVisible() {
		return super.getVisible();
	}

	@Override
	@ClientProperty(escapeValue = "zoom")
	public FloatControlAnimateType getAnimateType() {
		return animateType;
	}

	@Override
	public void setAnimateType(FloatControlAnimateType animateType) {
		this.animateType = animateType;
	}

	@Override
	public FloatControlAnimateType getShowAnimateType() {
		return showAnimateType;
	}

	@Override
	public void setShowAnimateType(FloatControlAnimateType showAnimateType) {
		this.showAnimateType = showAnimateType;
	}

	@Override
	public FloatControlAnimateType getHideAnimateType() {
		return hideAnimateType;
	}

	@Override
	public void setHideAnimateType(FloatControlAnimateType hideAnimateType) {
		this.hideAnimateType = hideAnimateType;
	}

	@Override
	@IdeProperty(visible = false)
	@Deprecated
	public String getAnimateTarget() {
		return animateTarget;
	}

	@Override
	@Deprecated
	public void setAnimateTarget(String animateTarget) {
		this.animateTarget = animateTarget;
	}

	@Override
	@IdeProperty(highlight = 1)
	public boolean isCenter() {
		return center;
	}

	@Override
	public void setCenter(boolean center) {
		this.center = center;
	}

	@Override
	@IdeProperty(highlight = 1)
	public boolean isModal() {
		return modal;
	}

	@Override
	public void setModal(boolean modal) {
		this.modal = modal;
	}

	@Override
	public ModalType getModalType() {
		return modalType;
	}

	@Override
	public void setModalType(ModalType modalType) {
		this.modalType = modalType;
	}

	@Override
	@ClientProperty(escapeValue = "sides")
	public FloatControlShadowMode getShadowMode() {
		return shadowMode;
	}

	@Override
	public void setShadowMode(FloatControlShadowMode shadowMode) {
		this.shadowMode = shadowMode;
	}

	@Override
	@ClientProperty(escapeValue = "true")
	public boolean isFocusAfterShow() {
		return focusAfterShow;
	}

	@Override
	public void setFocusAfterShow(boolean focusAfterShow) {
		this.focusAfterShow = focusAfterShow;
	}

	@Override
	@ClientProperty(escapeValue = "true")
	public boolean isContinuedFocus() {
		return continuedFocus;
	}

	@Override
	public void setContinuedFocus(boolean continuedFocus) {
		this.continuedFocus = continuedFocus;
	}

	/**
	 * @return the floating
	 */
	@Override
	@ClientProperty(escapeValue = "true")
	public boolean isFloating() {
		return floating;
	}

	/**
	 * @param floating the floating to set
	 */
	@Override
	public void setFloating(boolean floating) {
		this.floating = floating;
	}

	/**
	 * @return the floatingClassName
	 */
	@Override
	public String getFloatingClassName() {
		return floatingClassName;
	}

	/**
	 * @param floatingClassName the floatingClassName to set
	 */
	@Override
	public void setFloatingClassName(String floatingClassName) {
		this.floatingClassName = floatingClassName;
	}

	/**
	 * @return the left
	 */
	@Override
	public int getLeft() {
		return left;
	}

	/**
	 * @param left the left to set
	 */
	@Override
	public void setLeft(int left) {
		this.left = left;
	}

	/**
	 * @return the top
	 */
	@Override
	public int getTop() {
		return top;
	}

	/**
	 * @param top the top to set
	 */
	@Override
	public void setTop(int top) {
		this.top = top;
	}

	/**
	 * @return the offsetLeft
	 */
	@Override
	public int getOffsetLeft() {
		return offsetLeft;
	}

	/**
	 * @param offsetLeft the offsetLeft to set
	 */
	@Override
	public void setOffsetLeft(int offsetLeft) {
		this.offsetLeft = offsetLeft;
	}

	/**
	 * @return the offsetTop
	 */
	@Override
	public int getOffsetTop() {
		return offsetTop;
	}

	/**
	 * @param offsetTop the offsetTop to set
	 */
	@Override
	public void setOffsetTop(int offsetTop) {
		this.offsetTop = offsetTop;
	}

	/**
	 * @return the anchorTarget
	 */
	@Override
	@IdeProperty(visible = false)
	@Deprecated
	public String getAnchorTarget() {
		return anchorTarget;
	}

	/**
	 * @param anchorTarget the anchorTarget to set
	 */
	@Override
	@Deprecated
	public void setAnchorTarget(String anchorTarget) {
		this.anchorTarget = anchorTarget;
	}

	/**
	 * @return the align
	 */
	@Override
	@IdeProperty(visible = false)
	@Deprecated
	public FloatControlAlign getAlign() {
		return align;
	}

	/**
	 * @param align the align to set
	 */
	@Override
	@Deprecated
	public void setAlign(FloatControlAlign align) {
		this.align = align;
	}

	/**
	 * @return the vAlign
	 */
	@Override
	@IdeProperty(visible = false)
	@Deprecated
	public FloatControlVAlign getvAlign() {
		return vAlign;
	}

	/**
	 * @param vAlign the vAlign to set
	 */
	@Override
	@Deprecated
	public void setvAlign(FloatControlVAlign vAlign) {
		this.vAlign = vAlign;
	}

	/**
	 * @return the autoAdjustPosition
	 */
	@Override
	@ClientProperty(escapeValue = "true")
	public boolean isAutoAdjustPosition() {
		return autoAdjustPosition;
	}

	/**
	 * @param autoAdjustPosition the autoAdjustPosition to set
	 */
	@Override
	public void setAutoAdjustPosition(boolean autoAdjustPosition) {
		this.autoAdjustPosition = autoAdjustPosition;
	}

	/**
	 * @return the handleOverflow
	 */
	@Override
	@ClientProperty(escapeValue = "true")
	@IdeProperty(visible = false)
	@Deprecated
	public boolean isHandleOverflow() {
		return handleOverflow;
	}

	/**
	 * @param handleOverflow the handleOverflow to set
	 */
	@Override
	@Deprecated
	public void setHandleOverflow(boolean handleOverflow) {
		this.handleOverflow = handleOverflow;
	}

}
