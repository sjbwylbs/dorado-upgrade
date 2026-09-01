package com.bstek.dorado.web.listener;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;

public class ServletContextListenerProxy extends DelegatingServletContextListener {

	private ServletContextListener servletContextListener;

	public void setListener(ServletContextListener servletContextListener) {
		this.servletContextListener = servletContextListener;
	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		servletContextListener.contextInitialized(sce);
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		servletContextListener.contextDestroyed(sce);
	}

}
