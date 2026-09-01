package com.bstek.dorado.console;

import com.bstek.dorado.console.system.log.console.SystemOutTailWork;
import com.bstek.dorado.web.listener.DelegatingServletContextListener;

import jakarta.servlet.ServletContextEvent;

/**
 * Dorado Console Listener 启动控制台监听器
 *
 */
public class ConsoleLoaderListener extends DelegatingServletContextListener {

	@Override
	public int getOrder() {
		return 0;
	}

	@Override
	public void contextDestroyed(ServletContextEvent event) {
	}

	@Override
	public void contextInitialized(ServletContextEvent event) {
		SystemOutTailWork outTailWork = SystemOutTailWork.getInstance();
		outTailWork.startWork();
		Setting.setListenerActiveState(true);
	}

}
