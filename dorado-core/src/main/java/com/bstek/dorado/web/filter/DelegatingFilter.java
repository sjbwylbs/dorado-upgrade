package com.bstek.dorado.web.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public abstract class DelegatingFilter {

	private int order = 999;

	private List<String> urlPatterns;

	private List<String> excludeUrlPatterns;

	public int getOrder() {
		return order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

	protected List<String> formatUrlPatterns(List<String> urlPatterns) {
		if (urlPatterns == null) {
			return null;
		}

		List<String> formatedUrlPatterns = new ArrayList<>(urlPatterns.size());
		for (String urlPattern : urlPatterns) {
			if (urlPattern.length() > 0 && urlPattern.charAt(0) != '/') {
				urlPattern = '/' + urlPattern;
			}
			formatedUrlPatterns.add(urlPattern);
		}
		return formatedUrlPatterns;
	}

	public List<String> getUrlPatterns() {
		return urlPatterns;
	}

	public void setUrlPatterns(List<String> urlPatterns) {
		this.urlPatterns = formatUrlPatterns(urlPatterns);
	}

	public List<String> getExcludeUrlPatterns() {
		return excludeUrlPatterns;
	}

	public void setExcludeUrlPatterns(List<String> excludeUrlPatterns) {
		this.excludeUrlPatterns = formatUrlPatterns(excludeUrlPatterns);
	}

	public void init(FilterConfig filterConfig) throws ServletException {
	}

	public abstract void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException;

}
