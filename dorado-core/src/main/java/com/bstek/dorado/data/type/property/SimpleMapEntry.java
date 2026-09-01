package com.bstek.dorado.data.type.property;

public class SimpleMapEntry {

	private Object key;

	private Object value;

	public SimpleMapEntry() {
	}

	public SimpleMapEntry(Object key, Object value) {
		this.key = key;
		this.value = value;
	}

	public Object getKey() {
		return key;
	}

	public void setKey(Object key) {
		this.key = key;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public static SimpleMapEntry parseString(String s) {
		if (s == null) {
			return null;
		}
		int i = s.indexOf('=');
		if (i >= 0) {
			return new SimpleMapEntry(s.substring(0, i), s.substring(i + 1));
		}
		else {
			return new SimpleMapEntry(s, s);
		}
	}

}
