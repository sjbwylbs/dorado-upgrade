package com.bstek.dorado.view.widget;

import java.util.Map;

public interface RenderableElement extends HtmlElement {

	@Override
	String getClassName();

	@Override
	void setClassName(String className);

	@Override
	String getWidth();

	@Override
	void setWidth(String width);

	@Override
	String getHeight();

	@Override
	void setHeight(String height);

	@Override
	Map<String, Object> getStyle();

	@Override
	void setStyle(Map<String, Object> style);

}
