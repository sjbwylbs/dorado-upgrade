package com.bstek.dorado.console;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.console.authentication.AuthenticationManager;
import com.bstek.dorado.console.authentication.DefaultAuthenticationManager;
import com.bstek.dorado.core.Context;
import com.bstek.dorado.core.EngineStartupListener;
import com.bstek.dorado.web.loader.ConsoleStartedMessagesOutputter;

/**
 * Dorado Console Starter
 *
 */

public class Starter extends EngineStartupListener {

	private static Log logger = LogFactory.getLog(Starter.class);

	private ConsoleStartedMessagesOutputter consoleStartedMessagesOutputter;

	public void setConsoleStartedMessagesOutputter(ConsoleStartedMessagesOutputter consoleStartedMessagesOutputter) {
		this.consoleStartedMessagesOutputter = consoleStartedMessagesOutputter;
	}

	@Override
	public void onStartup() throws Exception {
		Setting.setStartTime(System.currentTimeMillis());
		AuthenticationManager authenticationManager = null;
		Context ctx = Context.getCurrent();
		try {
			authenticationManager = (AuthenticationManager) ctx.getServiceBean("authenticationManager");
		}
		catch (Exception e) {
			logger.warn(e);
			DefaultAuthenticationManager defaultAuthenticationManager = new DefaultAuthenticationManager();

			defaultAuthenticationManager.setConsoleStartedMessagesOutputter(consoleStartedMessagesOutputter);
			defaultAuthenticationManager.afterPropertiesSet();
			authenticationManager = defaultAuthenticationManager;
		}

		Setting.setAuthenticationManager(authenticationManager);

	}

}
