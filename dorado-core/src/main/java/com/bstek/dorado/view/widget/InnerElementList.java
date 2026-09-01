package com.bstek.dorado.view.widget;

import com.bstek.dorado.util.proxy.ChildrenListSupport;
import com.bstek.dorado.view.ViewElement;

public class InnerElementList<E> extends ChildrenListSupport<E> {

	private ViewElement parent;

	public InnerElementList(ViewElement parent) {
		this.parent = parent;
	}

	@Override
	protected void childAdded(E child) {
		if (child != null && child instanceof ViewElement) {
			ViewElement element = (ViewElement) child;
			parent.registerInnerElement(element);
			element.setParent(parent);
		}
	}

	@Override
	protected void childRemoved(E child) {
		if (child != null && child instanceof ViewElement) {
			ViewElement element = (ViewElement) child;
			element.setParent(null);
			parent.unregisterInnerElement(element);
		}
	}

}
