package com.bstek.dorado.view.widget;

import com.bstek.dorado.annotation.ClientProperty;

public class FloatControlAnimate {

	private FloatControlAnimateType animateType = FloatControlAnimateType.zoom;

	private FloatControlAnimateType showAnimateType;

	private FloatControlAnimateType hideAnimateType;

	private String animateTarget;

	@ClientProperty(escapeValue = "zoom")
	public FloatControlAnimateType getAnimateType() {
		return animateType;
	}

	public void setAnimateType(FloatControlAnimateType animateType) {
		this.animateType = animateType;
	}

	public FloatControlAnimateType getShowAnimateType() {
		return showAnimateType;
	}

	public void setShowAnimateType(FloatControlAnimateType showAnimateType) {
		this.showAnimateType = showAnimateType;
	}

	public FloatControlAnimateType getHideAnimateType() {
		return hideAnimateType;
	}

	public void setHideAnimateType(FloatControlAnimateType hideAnimateType) {
		this.hideAnimateType = hideAnimateType;
	}

	public String getAnimateTarget() {
		return animateTarget;
	}

	public void setAnimateTarget(String animateTarget) {
		this.animateTarget = animateTarget;
	}

}
