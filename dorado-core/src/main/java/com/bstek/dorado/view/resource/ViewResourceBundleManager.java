package com.bstek.dorado.view.resource;

import java.util.Locale;

import com.bstek.dorado.core.resource.ResourceBundle;
import com.bstek.dorado.view.config.definition.ViewConfigDefinition;

public interface ViewResourceBundleManager {

	public ResourceBundle getBundle(ViewConfigDefinition viewConfigDefinition, Locale locale) throws Exception;

}
