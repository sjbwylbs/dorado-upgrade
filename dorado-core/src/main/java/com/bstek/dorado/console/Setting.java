package com.bstek.dorado.console;

import com.bstek.dorado.console.authentication.AuthenticationManager;

/**
 * Dorado Console Setting
 *
 */
public final class Setting {

	private static AuthenticationManager authenticationManager;

	private static long startTime;

	private static boolean listenerActiveState = false;

	/**
	 * @return the authenticationManager
	 */
	public static AuthenticationManager getAuthenticationManager() {
		return authenticationManager;
	}

	/**
	 * @param authenticationManager the authenticationManager to set
	 */
	public static void setAuthenticationManager(AuthenticationManager authenticationManager) {
		Setting.authenticationManager = authenticationManager;
	}

	/**
	 * @return the startTime
	 */
	public static long getStartTime() {
		return startTime;
	}

	/**
	 * @param startTime the startTime to set
	 */
	public static void setStartTime(long startTime) {
		Setting.startTime = startTime;
	}

	/**
	 * @return the listenerActiveState
	 */
	public static boolean getListenerActiveState() {
		return listenerActiveState;
	}

	/**
	 * @param listenerActiveState the listenerActiveState to set
	 */
	public static void setListenerActiveState(boolean listenerActiveState) {
		Setting.listenerActiveState = listenerActiveState;
	}

}
