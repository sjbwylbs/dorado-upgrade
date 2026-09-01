package com.bstek.dorado.view.output;

public interface VirtualPropertyOutputter {

	/**
	 * @param object
	 * @param property
	 * @param context
	 * @throws Exception
	 */
	void output(Object object, String property, OutputContext context) throws Exception;

}
