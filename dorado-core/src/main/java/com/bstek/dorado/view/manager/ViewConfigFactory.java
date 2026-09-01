package com.bstek.dorado.view.manager;

public interface ViewConfigFactory {

	/**
	 * @param viewName
	 * @return
	 * @throws Exception
	 */
	ViewConfig create(String viewName) throws Exception;

}
