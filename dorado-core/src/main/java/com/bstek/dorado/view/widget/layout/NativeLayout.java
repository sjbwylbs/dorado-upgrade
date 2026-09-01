package com.bstek.dorado.view.widget.layout;

import com.bstek.dorado.annotation.ClientObject;

@ClientObject(shortTypeName = "Native")
public class NativeLayout extends Layout {

	private boolean lazyRenderChild;

	private String style;

	public boolean isLazyRenderChild() {
		return lazyRenderChild;
	}

	public void setLazyRenderChild(boolean lazyRenderChild) {
		this.lazyRenderChild = lazyRenderChild;
	}

	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

}
