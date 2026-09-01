package com.bstek.dorado.web;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import jakarta.servlet.http.HttpServletRequest;

public class RequestWrapperMap implements Map<String, Object> {

	private HttpServletRequest request;

	public RequestWrapperMap(HttpServletRequest request) {
		this.request = request;
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
		return request.getAttribute((String) key);
	}

	@Override
	public Object put(String key, Object value) {
		request.setAttribute(key, value);
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
