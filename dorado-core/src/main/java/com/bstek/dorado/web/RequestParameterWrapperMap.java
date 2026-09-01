package com.bstek.dorado.web;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import jakarta.servlet.http.HttpServletRequest;

public class RequestParameterWrapperMap implements Map<String, String> {

	private HttpServletRequest request;

	public RequestParameterWrapperMap(HttpServletRequest request) {
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
	public String get(Object key) {
		String result = request.getParameter((String) key);
		// if (StringUtils.isNotBlank(result)) {
		// result = cleanXSS(result);
		// }
		return result;
	}

	@Override
	public String put(String key, String value) {
		throw new UnsupportedOperationException();
	}

	@Override
	public String remove(Object key) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void putAll(Map<? extends String, ? extends String> m) {
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
	public Collection<String> values() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Set<java.util.Map.Entry<String, String>> entrySet() {
		throw new UnsupportedOperationException();
	}

	/*
	 * TODO: 此处的做法后面需要改进 1. 如果用户获得Request
	 * Parameter的目的不是向response输出，那么任何内容都是安全的，不能武断的把关键词过滤掉 2. 如何过滤关键词需要有一个词库或配置文件，下面的看起来并不全
	 */
	// private String cleanXSS(String value)
	// {
	// value = value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	// value = value.replaceAll("\\(", "&#40;").replaceAll("\\)", "&#41;");
	// value = value.replaceAll("'", "& #39;");
	// value = value.replaceAll("eval\\((.*)\\)", "");
	// value = value.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");
	// value = value.replace("window['location']=", "");
	// value = value.replace("window[\"location\"]=", "");
	// value = value.replaceAll("\\{*toString:(.*)\\}", "\"\"");
	// return value;
	// }

}
