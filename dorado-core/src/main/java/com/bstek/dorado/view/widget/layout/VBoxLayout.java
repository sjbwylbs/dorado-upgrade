package com.bstek.dorado.view.widget.layout;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.view.widget.Align;

@ClientObject(shortTypeName = "VBox")
public class VBoxLayout extends AbstractBoxLayout {

	private boolean lazyRenderChild;

	private Align align = Align.left;

	public boolean isLazyRenderChild() {
		return lazyRenderChild;
	}

	public void setLazyRenderChild(boolean lazyRenderChild) {
		this.lazyRenderChild = lazyRenderChild;
	}

	@ClientProperty(escapeValue = "left")
	public Align getAlign() {
		return align;
	}

	public void setAlign(Align align) {
		this.align = align;
	}

}
