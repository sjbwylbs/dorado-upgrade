package com.bstek.dorado.view.manager;

/**
 * 视图管理器。
 *
 */
public interface ViewConfigManager {

	/**
	 * @param viewNamePattern
	 * @param viewConfigFactory
	 */
	void registerViewConfigFactory(String viewNamePattern, Object viewConfigFactory);

	/**
	 * @param viewName
	 * @return
	 */
	Object getViewConfigFactory(String viewName);

	/**
	 * 根据视图的名称返回相应的视图对象。
	 * @param viewName 视图的名称。
	 * @return 视图对象。
	 * @throws Exception
	 */
	ViewConfig getViewConfig(String viewName) throws Exception;

}
