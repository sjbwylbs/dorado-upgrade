package com.bstek.dorado.web.listener;

import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

public class HttpSessionListenerProxy extends DelegatingSessionListener {

	private HttpSessionListener httpSessionListener;

	public void setListener(HttpSessionListener httpSessionListener) {
		this.httpSessionListener = httpSessionListener;
	}

	@Override
	public void sessionCreated(HttpSessionEvent se) {
		httpSessionListener.sessionCreated(se);
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
		httpSessionListener.sessionDestroyed(se);
	}

}
