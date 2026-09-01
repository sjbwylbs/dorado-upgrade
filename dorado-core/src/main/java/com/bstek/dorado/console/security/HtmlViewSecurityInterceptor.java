package com.bstek.dorado.console.security;

import org.springframework.web.servlet.HandlerInterceptor;

import com.bstek.dorado.console.Constants;
import com.bstek.dorado.console.Setting;
import com.bstek.dorado.util.PathUtils;
import com.bstek.dorado.view.resolver.HtmlViewResolver;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Dorado Console HtmlView 安全拦截器
 *
 *
 */
public class HtmlViewSecurityInterceptor implements HandlerInterceptor {

	private String interceptedNamePattern;

	public String getInterceptedNamePattern() {
		return interceptedNamePattern;
	}

	public void setInterceptedNamePattern(String interceptedNamePattern) {
		this.interceptedNamePattern = interceptedNamePattern;
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		String path = request.getRequestURI();
		Boolean loginStatus = Setting.getAuthenticationManager().isAuthenticated(request);
		if (handler instanceof HtmlViewResolver && PathUtils.match(interceptedNamePattern, path.replace('/', '.'))) {
			if (!loginStatus && path.indexOf(".dorado.console.Login") < 0) {
				response.sendRedirect(Constants.DORADO_CONSOLE_LOGIN_VIEW_PATH);
				return false;
			}
		}
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			org.springframework.web.servlet.ModelAndView modelAndView) throws Exception {
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
			Exception ex) throws Exception {
	}

}
