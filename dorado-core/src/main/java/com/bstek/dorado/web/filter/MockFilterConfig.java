package com.bstek.dorado.web.filter;

import java.util.Collections;
import java.util.Enumeration;
import java.util.Properties;

import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletContext;

public class MockFilterConfig implements FilterConfig {

	private String filterName;

	private ServletContext servletContext;

	private Properties initParameters;

	public MockFilterConfig(String filterName, ServletContext servletContext, Properties initParameters) {
		this.filterName = filterName;
		this.servletContext = servletContext;
		this.initParameters = initParameters;
	}

	@Override
	public String getFilterName() {
		return filterName;
	}

	@Override
	public ServletContext getServletContext() {
		return servletContext;
	}

	@Override
	public String getInitParameter(String name) {
		return (initParameters == null) ? null : initParameters.getProperty(name);
	}

	@Override
	@SuppressWarnings({ "unchecked" })
	public Enumeration<String> getInitParameterNames() {
		return (initParameters == null) ? Collections.enumeration(Collections.EMPTY_LIST)
				: (Enumeration<String>) initParameters.propertyNames();
	}

}
