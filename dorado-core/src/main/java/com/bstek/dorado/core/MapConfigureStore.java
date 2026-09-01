package com.bstek.dorado.core;

import java.util.HashSet;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

public class MapConfigureStore extends ConfigureStore {

	@SuppressWarnings("rawtypes")
	private Map map;

	public MapConfigureStore(Map<String, Object> map) {
		this.map = map;
	}

	public MapConfigureStore(Properties properties) {
		this.map = properties;
	}

	@Override
	public boolean contains(String key) {
		return map.containsKey(key);
	}

	@Override
	public Object get(String key) {
		return map.get(key);
	}

	@Override
	public void remove(String key) {
		map.remove(key);
	}

	@SuppressWarnings("unchecked")
	@Override
	protected void doSet(String key, Object value) {
		if (value != null) {
			map.put(key, value);
		}
		else {
			map.remove(key);
		}
	}

	@Override
	public Set<String> keySet() {
		Set<String> keys = new HashSet<>();
		for (Object key : map.keySet()) {
			keys.add(String.valueOf(key));
		}
		return keys;
	}

}
