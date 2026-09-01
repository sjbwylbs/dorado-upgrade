package com.bstek.dorado.web.resolver;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import com.bstek.dorado.core.Configure;
import com.bstek.dorado.util.PathUtils;
import com.bstek.dorado.web.DoradoContext;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 使请求支持WebContext的抽象Web控制器。
 *
 */
public abstract class WebContextSupportedController extends AbstractController {

	private static final char ESCAPED_PATH_DELIM = '^';

	/**
	 * 返回请求的相对URI，即相对于应用的ContentPath的URI。
	 */
	protected String getRequestPath(HttpServletRequest request) throws UnsupportedEncodingException {
		String uri = (String) request.getAttribute(UriResolverMapping.ORIGINAL_URL_PATH_ATTRIBUTE);
		if (uri == null) {
			uri = request.getServletPath();
			if (request.getServletPath() != null) {
				uri += request.getServletPath();
			}
		}
		uri = StringUtils.replaceChars(URLDecoder.decode(uri, Configure.getString("view.uriEncoding")),
				ESCAPED_PATH_DELIM, PathUtils.PATH_DELIM);
		if (uri.length() > 1 && uri.charAt(0) == PathUtils.PATH_DELIM) {
			uri = uri.substring(1);
		}
		return uri;
	}

	protected abstract ModelAndView doHandleRequest(HttpServletRequest request, HttpServletResponse response)
			throws Exception;

	@Override
	protected final ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		DoradoContext.init(getServletContext(), request);
		try {
			return doHandleRequest(request, response);
		}
		finally {
			DoradoContext.dispose(request);
		}
	}

}
