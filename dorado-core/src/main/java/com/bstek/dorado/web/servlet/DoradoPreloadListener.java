package com.bstek.dorado.web.servlet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.web.listener.DelegatingServletContextListenersManager;
import com.bstek.dorado.web.listener.DelegatingSessionListenersManager;
import com.bstek.dorado.web.loader.DoradoLoader;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

public class DoradoPreloadListener implements ServletContextListener, HttpSessionListener {

	private static final Log logger = LogFactory.getLog(DoradoPreloadListener.class);

	@Override
	public void contextInitialized(ServletContextEvent event) {
		try {
			DelegatingServletContextListenersManager.fireContextInitialized(event);

			DoradoLoader doradoLoader = DoradoLoader.getInstance();
			if (!doradoLoader.isPreloaded()) {
				ServletContext servletContext = event.getServletContext();
				doradoLoader.preload(servletContext, false);
			}
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent event) {
		try {
			DelegatingServletContextListenersManager.fireContextDestroyed(event);
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

	@Override
	public void sessionCreated(HttpSessionEvent event) {
		try {
			DelegatingSessionListenersManager.fireSessionCreated(event);
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		try {
			DelegatingSessionListenersManager.fireSessionDestroyed(event);
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

}
