package com.bstek.dorado.data.type.property;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlProperty;

public class Mapping {

	private Object mapValues;

	private String keyProperty;

	private String valueProperty;

	@XmlProperty(parser = "spring:dorado.mapValuesParser")
	@IdeProperty(editor = "collection[pojo]")
	public Object getMapValues() {
		return mapValues;
	}

	public void setMapValues(Object mapValues) {
		this.mapValues = mapValues;
	}

	public String getKeyProperty() {
		return keyProperty;
	}

	public void setKeyProperty(String keyProperty) {
		this.keyProperty = keyProperty;
	}

	public String getValueProperty() {
		return valueProperty;
	}

	public void setValueProperty(String valueProperty) {
		this.valueProperty = valueProperty;
	}

	public static Mapping parseString(String s) {
		if (s == null) {
			return null;
		}

		Mapping mapping = new Mapping();
		mapping.setKeyProperty("key");
		mapping.setValueProperty("value");

		List<Object> mapValues = new ArrayList<>();
		mapping.setMapValues(mapValues);
		for (String item : StringUtils.split(s, ";,\n\r")) {
			mapValues.add(SimpleMapEntry.parseString(item));
		}
		return mapping;
	}

}
