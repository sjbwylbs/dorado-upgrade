package com.bstek.dorado.view;

import java.util.Collection;

import com.bstek.dorado.data.method.ParameterFactory;
import com.bstek.dorado.web.DoradoContext;

import jakarta.servlet.http.HttpServletRequest;

public class DefaultSystemOptionalParametersFactory
		extends com.bstek.dorado.data.method.DefaultSystemOptionalParametersFactory {

	public DefaultSystemOptionalParametersFactory() {
		Collection<ParameterFactory> parametersFactory = getOptionalParameters();

		parametersFactory.add(new ParameterFactory() {
			@Override
			public Object getParameter() {
				return DoradoContext.getAttachedRequest();
			}

			@Override
			public String getParameterName() {
				return "request";
			}

			@Override
			public Class<?> getParameterType() {
				return HttpServletRequest.class;
			}
		});
	}

}
