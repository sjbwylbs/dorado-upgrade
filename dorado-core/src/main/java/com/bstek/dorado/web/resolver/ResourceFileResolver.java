package com.bstek.dorado.web.resolver;

import org.springframework.web.servlet.ModelAndView;

import com.bstek.dorado.web.WebConfigure;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ResourceFileResolver extends WebFileResolver {

	@Override
	protected ModelAndView doHandleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		response.addHeader(HttpConstants.CACHE_CONTROL,
				HttpConstants.MAX_AGE + WebConfigure.getLong("web.resourceMaxAge", 3600));
		return super.doHandleRequest(request, response);
	}

}
