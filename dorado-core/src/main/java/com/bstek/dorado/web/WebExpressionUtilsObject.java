package com.bstek.dorado.web;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.core.Configure;
import com.bstek.dorado.util.PathUtils;

public class WebExpressionUtilsObject {

	public String getContextPath() {
		try {
			String contextPath = Configure.getString("web.contextPath");
			if (StringUtils.isEmpty(contextPath)) {
				contextPath = DoradoContext.getAttachedRequest().getContextPath();
			}
			return contextPath;
		}
		catch (Exception e) {
			return "/";
		}
	}

	public String url(String urlPattern) {
		if (StringUtils.isNotEmpty(urlPattern)) {
			if (urlPattern.charAt(0) == '>') {
				return PathUtils.concatPath(getContextPath(), urlPattern.substring(1));
			}
		}
		return urlPattern;
	}

}
