package com.bstek.dorado.web.filter;

import java.io.IOException;
import java.util.List;

import org.springframework.util.PathMatcher;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class DelegatingFilterChain implements FilterChain {

	private List<DelegatingFilter> targetFilters;

	private int index = 0;

	private PathMatcher pathMatcher;

	private FilterChain realFilterChain;

	public DelegatingFilterChain(List<DelegatingFilter> targetFilters, PathMatcher pathMatcher,
			FilterChain realFilterChain) {
		this.targetFilters = targetFilters;
		this.pathMatcher = pathMatcher;
		this.realFilterChain = realFilterChain;
	}

	private String getRequestPath(HttpServletRequest request) {
		String url = request.getServletPath();
		if (request.getServletPath() != null) {
			url += request.getServletPath();
		}
		return url;
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response) throws IOException, ServletException {
		boolean matched = false;
		int filterNum = targetFilters.size();
		if (index >= filterNum) {
			realFilterChain.doFilter(request, response);
		}
		else {
			while (index < filterNum) {
				DelegatingFilter targetFilter = targetFilters.get(index);
				index++;

				List<String> urlPatterns = targetFilter.getUrlPatterns();
				if (urlPatterns != null) {
					String path = getRequestPath((HttpServletRequest) request);
					for (String pattern : urlPatterns) {
						if (pathMatcher.match(pattern, path)) {
							matched = true;
							break;
						}
					}

					if (matched) {
						List<String> excludeUrlPatterns = targetFilter.getExcludeUrlPatterns();
						if (excludeUrlPatterns != null) {
							for (String pattern : excludeUrlPatterns) {
								if (pathMatcher.match(pattern, path)) {
									matched = false;
									break;
								}
							}
						}
					}
				}
				else {
					matched = true;
				}

				if (matched) {
					targetFilter.doFilter((HttpServletRequest) request, (HttpServletResponse) response, this);
					break;
				}
			}

			if (!matched) {
				realFilterChain.doFilter(request, response);
			}
		}
	}

}
