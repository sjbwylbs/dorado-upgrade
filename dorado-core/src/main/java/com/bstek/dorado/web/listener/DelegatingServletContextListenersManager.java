package com.bstek.dorado.web.listener;

import java.util.Collection;
import java.util.Comparator;
import java.util.TreeSet;

import com.bstek.dorado.core.pkgs.PackageInfo;
import com.bstek.dorado.core.pkgs.PackageManager;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;

public final class DelegatingServletContextListenersManager {

	private DelegatingServletContextListenersManager() {
	}

	private static Collection<ServletContextListener> servletContextListeners;

	public static void fireContextInitialized(ServletContextEvent event) throws Exception {
		servletContextListeners = new TreeSet<>(new Comparator<ServletContextListener>() {
			private static final int DEFAULT_ORDER = DelegatingServletContextListener.DEFAULT_ORDER;

			@Override
			public int compare(ServletContextListener l1, ServletContextListener l2) {
				int o1 = (l1 instanceof DelegatingServletContextListener)
						? ((DelegatingServletContextListener) l1).getOrder() : DEFAULT_ORDER;
				int o2 = (l2 instanceof DelegatingServletContextListener)
						? ((DelegatingServletContextListener) l2).getOrder() : DEFAULT_ORDER;
				return o1 - o2;
			}
		});

		for (PackageInfo packageInfo : PackageManager.getPackageInfoMap().values()) {
			if (packageInfo.getServletContextListener() != null) {
				servletContextListeners.add(packageInfo.getServletContextListener());
			}
		}

		if (servletContextListeners.isEmpty()) {
			servletContextListeners = null;
		}
		else {
			for (ServletContextListener listener : servletContextListeners) {
				listener.contextInitialized(event);
			}
		}
	}

	public static void fireContextDestroyed(ServletContextEvent event) throws Exception {
		if (servletContextListeners != null) {
			for (ServletContextListener listener : servletContextListeners) {
				listener.contextDestroyed(event);
			}
		}
	}

}
