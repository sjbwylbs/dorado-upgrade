package com.bstek.dorado.view.widget.layout;

import com.bstek.dorado.annotation.ClientObject;

/**
 * Border型布局管理器。
 *
 */
@ClientObject(shortTypeName = "Dock")
public class DockLayout extends Layout {

	private int regionPadding;

	public int getRegionPadding() {
		return regionPadding;
	}

	public void setRegionPadding(int regionPadding) {
		this.regionPadding = regionPadding;
	}

}
