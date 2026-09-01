package com.bstek.dorado.web.listener;

import jakarta.servlet.ServletContextListener;

public abstract class DelegatingServletContextListener implements ServletContextListener {

	public static final int DEFAULT_ORDER = 999;

	public int getOrder() {
		return DEFAULT_ORDER;
	}

}
