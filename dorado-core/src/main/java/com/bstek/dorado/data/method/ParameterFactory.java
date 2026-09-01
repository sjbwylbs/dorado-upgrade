package com.bstek.dorado.data.method;

public interface ParameterFactory {

	public Object getParameter();

	public String getParameterName();

	public Class<?> getParameterType();

}
