package com.bstek.dorado.web;

import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.core.el.ContextVarsInitializer;
import com.bstek.dorado.util.SingletonBeanFactory;

import jakarta.servlet.http.HttpServletRequest;

public class WebContextVarsInitializer implements ContextVarsInitializer {

	private static final Log logger = LogFactory.getLog(WebContextVarsInitializer.class);

	@Override
	public void initializeContext(Map<String, Object> vars) {
		try {
			vars.put("configure", WebConfigure.getStore());
			try {
				HttpServletRequest request = DoradoContext.getAttachedRequest();
				vars.put("request", request);
				vars.put("req", new RequestWrapperMap(request));
				vars.put("param", new RequestParameterWrapperMap(request));
				vars.put("session", (request != null) ? request.getSession(false) : null);
				vars.put("servletContext", DoradoContext.getAttachedServletContext());
			}
			catch (UnsupportedOperationException e) {
				// do nothing
			}
			vars.put("web", SingletonBeanFactory.getInstance(WebExpressionUtilsObject.class));
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

}
