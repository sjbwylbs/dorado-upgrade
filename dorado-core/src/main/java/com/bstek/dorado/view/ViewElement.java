package com.bstek.dorado.view;

import java.util.Collection;

public interface ViewElement {

	void setId(String id);

	String getId();

	void setParent(ViewElement parent);

	ViewElement getParent();

	View getView();

	void registerInnerElement(ViewElement element);

	void unregisterInnerElement(ViewElement element);

	Collection<ViewElement> getInnerElements();

}
