package com.bstek.dorado.view;

import java.util.Collection;

public abstract class ViewElementUtils {

	private ViewElementUtils() {
	}

	public static View getParentView(ViewElement parent) {
		if (parent instanceof View) {
			return (View) parent;
		}
		else {
			return parent.getView();
		}
	}

	private static void unregisterFromView(ViewElement element, View view) {
		Collection<ViewElement> innerElements = element.getInnerElements();
		if (innerElements != null) {
			for (ViewElement innerElement : innerElements) {
				unregisterFromView(innerElement, view);
			}
		}

		view.unregisterViewElement(element);
	}

	public static void clearParentViewElement(ViewElement element, ViewElement oldParent) {
		if (oldParent == null) {
			return;
		}
		View view = getParentView(oldParent);
		if (view != null) {
			unregisterFromView(element, view);
		}
	}

	private static void registerToView(ViewElement element, View view) {
		view.registerViewElement(element);

		Collection<ViewElement> innerElements = element.getInnerElements();
		if (innerElements != null) {
			for (ViewElement innerElement : innerElements) {
				registerToView(innerElement, view);
			}
		}
	}

	public static void setParentViewElement(ViewElement element, ViewElement parent) {
		if (parent != null) {
			View view = getParentView(parent);
			if (view != null) {
				registerToView(element, view);
			}
		}
	}

}
