package com.bstek.dorado.console.authentication;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 认证管理器接口
 *
 *
 */
public interface AuthenticationManager {

	/**
	 * 验证用户名密码是否正确
	 * @param
	 * @return
	 */
	boolean authenticate(String name, String password);

	/**
	 * 获得认证状态
	 * @return
	 */
	boolean isAuthenticated(HttpServletRequest request);

}
