package com.bstek.dorado.console.authentication;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 禁止一切人员登陆Console
 *
 *
 */
public class ForbiddenAuthenticationManager implements AuthenticationManager {

	@Override
	public boolean authenticate(String name, String password) {
		return false;
	}

	@Override
	public boolean isAuthenticated(HttpServletRequest request) {
		return false;
	}

}
