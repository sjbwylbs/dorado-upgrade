package com.bstek.dorado.web.resolver;

import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import com.bstek.dorado.core.Configure;
import com.bstek.dorado.util.PathUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public abstract class AbstractControllerResolver extends WebContextSupportedController {

	private String uriPrefix;

	private int uriPrefixLen;

	private String uriSuffix = ".c";

	private int uriSuffixLen = uriSuffix.length();

	public void setUriPrefix(String uriPrefix) {
		if (uriPrefix != null && uriPrefix.charAt(0) == PathUtils.PATH_DELIM) {
			uriPrefix = uriPrefix.substring(1);
		}
		this.uriPrefix = uriPrefix;
		uriPrefixLen = (uriPrefix != null) ? uriPrefix.length() : 0;
	}

	public void setUriSuffix(String uriSuffix) {
		this.uriSuffix = uriSuffix;
		uriSuffixLen = (uriSuffix != null) ? uriSuffix.length() : 0;
	}

	protected String extractControllerName(String uri) {
		String controllerName = StringUtils.substringBefore(uri, ";");
		if (uriPrefix != null && controllerName.startsWith(uriPrefix)) {
			controllerName = controllerName.substring(uriPrefixLen);
		}
		if (uriSuffix != null && controllerName.endsWith(uriSuffix)) {
			controllerName = controllerName.substring(0, controllerName.length() - uriSuffixLen);
		}
		return controllerName;
	}

	@Override
	protected ModelAndView doHandleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String referer = request.getHeader("referer");
		if (StringUtils.isNotEmpty(referer)) {
			String refererPattern = Configure.getString("security.refererPattern");
			if (StringUtils.isNotEmpty(refererPattern) && !Pattern.matches(refererPattern, referer)) {
				throw new PageAccessDeniedException("Cross-Site request forbidden.");
			}
		}

		String uri = getRequestPath(request);
		if (!PathUtils.isSafePath(uri)) {
			throw new PageAccessDeniedException("[" + request.getRequestURI() + "] Request forbidden.");
		}

		String controllerName = extractControllerName(uri);
		Controller controller = getController(controllerName);
		return controller.handleRequest(request, response);
	}

	protected abstract Controller getController(String controllerName) throws Exception;

}
