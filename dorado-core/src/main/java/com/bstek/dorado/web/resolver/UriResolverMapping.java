package com.bstek.dorado.web.resolver;

import org.springframework.http.server.RequestPath;
import org.springframework.web.servlet.handler.AbstractUrlHandlerMapping;

import com.bstek.dorado.util.Assert;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 基于 URL 的解析器映射。
 * <p>
 * 自 Spring 6.0 起 {@link AbstractUrlHandlerMapping} 默认启用
 * {@link org.springframework.web.util.pattern.PathPatternParser}，本映射直接使用
 * 解析后的 {@link org.springframework.web.util.pattern.PathPattern} 进行匹配。
 * </p>
 */
public class UriResolverMapping extends AbstractUrlHandlerMapping {

	/**
	 * 原始请求路径的请求属性名，供 Dorado 控制器通过
	 * {@code WebContextSupportedController#getRequestPath} 读取。
	 */
	public static final String ORIGINAL_URL_PATH_ATTRIBUTE = "originalUrlPath";

	@Override
	protected Object lookupHandler(RequestPath path, String lookupPath, HttpServletRequest request)
			throws Exception {
		Object handler = super.lookupHandler(path, lookupPath, request);
		if (handler != null) {
			request.setAttribute(ORIGINAL_URL_PATH_ATTRIBUTE, lookupPath);
		}
		return handler;
	}

	@Override
	public void registerHandler(String urlPath, Object handler) {
		Assert.notNull(urlPath, "URL path must not be null");
		// PathPattern 语法中 "**" 元素只允许出现在模式的最开头或最末尾，
		// 因此以 "**" 开头的模式（如 "**\/*.c"）不能补充前导 "/"，
		// 其余相对路径仍规范化为 "/..." 形式。
		if (!urlPath.startsWith("/") && !urlPath.startsWith("**")) {
			urlPath = "/" + urlPath;
		}
		super.registerHandler(urlPath, handler);
	}

}
