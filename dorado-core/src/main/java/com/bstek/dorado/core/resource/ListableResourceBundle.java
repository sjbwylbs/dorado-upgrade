package com.bstek.dorado.core.resource;

import java.util.Enumeration;

public interface ListableResourceBundle extends ResourceBundle {

	Enumeration<String> getKeys();

}
