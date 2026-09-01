package com.bstek.dorado.view.config.xml;

import com.bstek.dorado.config.ParseContext;

public class PreparseContext extends ParseContext {

	private String viewName;

	private boolean inPlaceHolderSection;

	/**
	 * @param viewName 当前正被解析的视图的名称。
	 */
	public PreparseContext(String viewName) {
		this.viewName = viewName;
	}

	/**
	 * 返回当前正被解析的视图的名称。
	 */
	public String getViewName() {
		return viewName;
	}

	public boolean isInPlaceHolderSection() {
		return inPlaceHolderSection;
	}

	public void setInPlaceHolderSection(boolean inImportableSection) {
		this.inPlaceHolderSection = inImportableSection;
	}

}
