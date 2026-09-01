package com.bstek.dorado.web;

import java.util.Hashtable;
import java.util.Map;

import com.bstek.dorado.core.bean.Scope;
import com.bstek.dorado.core.bean.ScopeManager;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

/**
 * 用于对Web应用中各种对象进行生命周期管理的管理器。
 *
 */
public class WebScopeManager extends ScopeManager {

	private static final String ATTRIBUTE = "$ScopeManager";

	private HttpServletRequest getAttachedRequest() {
		HttpServletRequest request = DoradoContext.getAttachedRequest();
		if (request == null) {
			throw new IllegalStateException(
					"Can not get attached HttpServletRequest, current thread may not be a request thread.");
		}
		return request;
	}

	@SuppressWarnings("unchecked")
	private Map<String, Object> getRequestContext() {
		HttpServletRequest request = getAttachedRequest();
		Map<String, Object> map = (Map<String, Object>) request.getAttribute(ATTRIBUTE);
		if (map == null) {
			map = new Hashtable<>();
			request.setAttribute(ATTRIBUTE, map);
		}
		return map;
	}

	@SuppressWarnings("unchecked")
	private Map<String, Object> getSessionContext() {
		HttpServletRequest request = getAttachedRequest();
		HttpSession session = request.getSession();
		Map<String, Object> map = (Map<String, Object>) session.getAttribute(ATTRIBUTE);
		if (map == null) {
			map = new Hashtable<>();
			session.setAttribute(ATTRIBUTE, map);
		}
		return map;
	}

	@Override
	public Object getBean(Scope scope, String key) {
		if (Scope.request.equals(scope)) {
			return getRequestContext().get(key);
		}
		else if (Scope.session.equals(scope)) {
			return getSessionContext().get(key);
		}
		else {
			return super.getBean(scope, key);
		}
	}

	@Override
	public void putBean(Scope scope, String key, Object bean) {
		if (Scope.request.equals(scope)) {
			getRequestContext().put(key, bean);
		}
		else if (Scope.session.equals(scope)) {
			getSessionContext().put(key, bean);
		}
		else {
			super.putBean(scope, key, bean);
		}
	}

	@Override
	public Object removeBean(Scope scope, String key) {
		if (Scope.request.equals(scope)) {
			return getRequestContext().remove(key);
		}
		else if (Scope.session.equals(scope)) {
			return getSessionContext().remove(key);
		}
		else {
			return super.removeBean(scope, key);
		}
	}

	@Override
	public void clear(Scope scope) {
		if (Scope.request.equals(scope)) {
			getRequestContext().clear();
		}
		else if (Scope.session.equals(scope)) {
			getSessionContext().clear();
		}
		else {
			super.clear(scope);
		}
	}

}
