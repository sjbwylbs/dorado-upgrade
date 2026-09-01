package com.bstek.dorado.core.resource;

import java.util.Locale;

public interface GlobalResourceBundleManager {

	public ResourceBundle getBundle(String bundleName, Locale locale) throws Exception;

}
