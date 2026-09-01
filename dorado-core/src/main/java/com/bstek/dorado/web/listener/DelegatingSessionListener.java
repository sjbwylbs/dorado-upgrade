package com.bstek.dorado.web.listener;

import jakarta.servlet.http.HttpSessionListener;

public abstract class DelegatingSessionListener implements HttpSessionListener {

	public static final int DEFAULT_ORDER = 999;

	public int getOrder() {
		return DEFAULT_ORDER;
	}

}
