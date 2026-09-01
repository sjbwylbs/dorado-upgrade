package com.bstek.dorado.data.method;

import java.util.ArrayList;
import java.util.Collection;

import com.bstek.dorado.core.Context;

public class DefaultSystemOptionalParametersFactory implements SystemOptionalParametersFactory {

	private Collection<ParameterFactory> parametersFactory;

	public DefaultSystemOptionalParametersFactory() {
		parametersFactory = new ArrayList<>();

		parametersFactory.add(new ParameterFactory() {
			@Override
			public Object getParameter() {
				return Context.getCurrent();
			}

			@Override
			public String getParameterName() {
				return "context";
			}

			@Override
			public Class<?> getParameterType() {
				return Context.class;
			}
		});
	}

	@Override
	public Collection<ParameterFactory> getOptionalParameters() {
		return parametersFactory;
	}

}
