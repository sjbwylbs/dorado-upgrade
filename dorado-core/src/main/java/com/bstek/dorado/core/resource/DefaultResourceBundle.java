package com.bstek.dorado.core.resource;

import java.io.Serializable;
import java.util.Enumeration;
import java.util.Properties;

public class DefaultResourceBundle implements ListableResourceBundle, Serializable {

	private static final long serialVersionUID = 7678593697684435624L;

	private Properties properties;

	public DefaultResourceBundle(Properties properties) {
		this.properties = properties;
	}

	@Override
	public String getString(String key, Object... args) {
		String result = properties.getProperty(key);
		if (result != null && args != null) {
			result = String.format(result, args);
		}
		return result;
	}

	@Override
	public Enumeration<String> getKeys() {
		return new KeyEnumeration(properties.keys());
	}

}

class KeyEnumeration implements Enumeration<String> {

	private Enumeration<Object> enumeration;

	public KeyEnumeration(Enumeration<Object> enumeration) {
		this.enumeration = enumeration;
	}

	@Override
	public boolean hasMoreElements() {
		return enumeration.hasMoreElements();
	}

	@Override
	public String nextElement() {
		return (String) enumeration.nextElement();
	}

}
