package com.bstek.dorado.core;

public interface ConfigureListener {

	public void beforeConfigureChange(String property, Object newValue);

	public void onConfigureChange(String property);

}
