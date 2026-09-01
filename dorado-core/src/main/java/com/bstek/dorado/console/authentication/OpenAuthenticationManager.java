package com.bstek.dorado.console.authentication;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 允许任何一个用户登陆Console
 *
 *
 */
public class OpenAuthenticationManager implements AuthenticationManager {

	@Override
	public boolean authenticate(String name, String password) {
		return true;
	}

	@Override
	public boolean isAuthenticated(HttpServletRequest request) {
		return true;
	}

}
