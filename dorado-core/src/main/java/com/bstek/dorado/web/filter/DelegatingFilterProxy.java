package com.bstek.dorado.web.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.beans.factory.BeanFactoryUtils;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

public class DelegatingFilterProxy implements Filter {

	private List<DelegatingFilter> targetFilters;

	private PathMatcher pathMatcher;

	private ServletContext servletContext;

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		servletContext = filterConfig.getServletContext();
	}

	private WebApplicationContext getWebApplicationContext(ServletRequest request) {
		WebApplicationContext wac = WebApplicationContextUtils
			.getWebApplicationContext(((HttpServletRequest) request).getSession().getServletContext());
		return wac;
	}

	@SuppressWarnings("unchecked")
	private List<DelegatingFilter> getTargetFilters(ServletRequest request) throws ServletException {
		if (targetFilters == null) {
			WebApplicationContext wac = getWebApplicationContext(request);
			Map<String, DelegatingFilter> targetFilterMap = BeanFactoryUtils.beansOfTypeIncludingAncestors(wac,
					DelegatingFilter.class);

			if (targetFilterMap.isEmpty()) {
				targetFilters = Collections.EMPTY_LIST;
			}
			else {
				Set<DelegatingFilter> treeSet = new TreeSet<>(new Comparator<DelegatingFilter>() {
					@Override
					public int compare(DelegatingFilter o1, DelegatingFilter o2) {
						int gap = o1.getOrder() - o2.getOrder();
						if (gap != 0) {
							return gap;
						}
						return (o1 == o2) ? 0 : 1;
					}
				});

				treeSet.addAll(targetFilterMap.values());
				targetFilters = new ArrayList<>(treeSet);
				for (DelegatingFilter targetFilter : targetFilters) {
					if (targetFilter instanceof FilterProxy) {
						FilterProxy filterProxy = (FilterProxy) targetFilter;
						FilterConfig filterConfig = new MockFilterConfig(filterProxy.getName(), servletContext,
								filterProxy.getInitParameters());
						targetFilter.init(filterConfig);
					}
				}
			}
		}
		return targetFilters;
	}

	private PathMatcher getPathMatcher(ServletRequest request) {
		if (pathMatcher == null) {
			WebApplicationContext wac = getWebApplicationContext(request);
			if (wac.containsBean("dorado.pathMatcher")) {
				pathMatcher = (PathMatcher) wac.getBean("dorado.pathMatcher");
			}
			else {
				pathMatcher = new AntPathMatcher();
			}
		}
		return pathMatcher;
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		List<DelegatingFilter> filters = getTargetFilters(request);
		if (filters.isEmpty()) {
			chain.doFilter(request, response);
		}
		else {
			DelegatingFilterChain delegatingFilterChain = new DelegatingFilterChain(filters, getPathMatcher(request),
					chain);
			delegatingFilterChain.doFilter(request, response);
		}
	}

	@Override
	public void destroy() {
	}

}
