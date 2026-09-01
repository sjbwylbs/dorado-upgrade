package com.bstek.dorado.view.widget.base;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.Control;
import com.bstek.dorado.view.widget.FloatControl;
import com.bstek.dorado.view.widget.FloatControlAlign;
import com.bstek.dorado.view.widget.FloatControlAnimateType;
import com.bstek.dorado.view.widget.FloatControlShadowMode;
import com.bstek.dorado.view.widget.FloatControlVAlign;
import com.bstek.dorado.view.widget.ModalType;

@Widget(name = "Tip", category = "Floatable", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.Tip", shortTypeName = "Tip")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class Tip extends Control implements FloatControl {

	private FloatControlAnimateType animateType = FloatControlAnimateType.fade;

	private FloatControlAnimateType showAnimateType;

	private FloatControlAnimateType hideAnimateType;

	private String animateTarget;

	private boolean center;

	private boolean modal;

	private ModalType modalType = ModalType.dark;

	private FloatControlShadowMode shadowMode = FloatControlShadowMode.drop;

	private boolean focusAfterShow = false;

	private boolean continuedFocus = true;

	private String caption;

	private String text;

	private Object content;

	private String icon;

	private boolean closeable;

	private TipArrowDirection arrowDirection = TipArrowDirection.none;

	private int arrowOffset;

	private TipArrowAlign arrowAlign = TipArrowAlign.center;

	private int showDuration;

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

	public Tip() {
		setVisible(null);
	}

	@Override
	public Boolean getVisible() {
		return super.getVisible();
	}

	@Override
	@ClientProperty(escapeValue = "fade")
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
	public boolean isCenter() {
		return center;
	}

	@Override
	public void setCenter(boolean center) {
		this.center = center;
	}

	@Override
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
	@ClientProperty(escapeValue = "drop")
	public FloatControlShadowMode getShadowMode() {
		return shadowMode;
	}

	@Override
	public void setShadowMode(FloatControlShadowMode shadowMode) {
		this.shadowMode = shadowMode;
	}

	@Override
	@ClientProperty(escapeValue = "false")
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

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	@IdeProperty(editor = "multilines")
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@XmlProperty
	@ClientProperty
	public Object getContent() {
		return content;
	}

	public void setContent(Object content) {
		this.content = content;
	}

	@IdeProperty(enumValues = "INFO,WARNING,ERROR,QUESTION")
	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public boolean isCloseable() {
		return closeable;
	}

	public void setCloseable(boolean closeable) {
		this.closeable = closeable;
	}

	@ClientProperty(escapeValue = "none")
	public TipArrowDirection getArrowDirection() {
		return arrowDirection;
	}

	public void setArrowDirection(TipArrowDirection arrowDirection) {
		this.arrowDirection = arrowDirection;
	}

	public int getArrowOffset() {
		return arrowOffset;
	}

	public void setArrowOffset(int arrowOffset) {
		this.arrowOffset = arrowOffset;
	}

	@ClientProperty(escapeValue = "center")
	public TipArrowAlign getArrowAlign() {
		return arrowAlign;
	}

	public void setArrowAlign(TipArrowAlign arrowAlign) {
		this.arrowAlign = arrowAlign;
	}

	public int getShowDuration() {
		return showDuration;
	}

	public void setShowDuration(int showDuration) {
		this.showDuration = showDuration;
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
