package com.bstek.dorado.core.el;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import com.bstek.dorado.core.Context;

public class ContextWrapperMap implements Map<String, Object> {

	private Context context;

	public ContextWrapperMap(Context context) {
		this.context = context;
	}

	@Override
	public int size() {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean isEmpty() {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean containsKey(Object key) {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean containsValue(Object value) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Object get(Object key) {
		return context.getAttribute((String) key);
	}

	@Override
	public Object put(String key, Object value) {
		context.setAttribute(key, value);
		return value;
	}

	@Override
	public Object remove(Object key) {

		throw new UnsupportedOperationException();
	}

	@Override
	public void putAll(Map<? extends String, ? extends Object> m) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void clear() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Set<String> keySet() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Collection<Object> values() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Set<java.util.Map.Entry<String, Object>> entrySet() {
		throw new UnsupportedOperationException();
	}

}
