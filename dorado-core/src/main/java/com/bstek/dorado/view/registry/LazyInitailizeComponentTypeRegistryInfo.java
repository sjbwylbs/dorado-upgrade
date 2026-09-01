package com.bstek.dorado.view.registry;

public interface LazyInitailizeComponentTypeRegistryInfo {

	/**
	 * @return
	 */
	public boolean isInitialized();

	/**
	 * @throws Exception
	 */
	public void initialize() throws Exception;

}
