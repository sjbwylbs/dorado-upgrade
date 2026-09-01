package com.bstek.dorado.web.servlet;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.BeansException;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.View;

import com.bstek.dorado.core.Configure;
import com.bstek.dorado.spring.RemovableBeanUtils;
import com.bstek.dorado.web.ConsoleUtils;
import com.bstek.dorado.web.loader.DoradoLoader;
import com.bstek.dorado.web.resolver.ErrorPageView;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;

/**
 * 用于提供dorado引擎服务的Servlet，同时可用于在Web服务器启动时完成dorado引擎的初始化。
 *
 */
public class DoradoServlet extends DispatcherServlet {

	private static final long serialVersionUID = 5788753993615625187L;

	private static final String SERVLET_CONTEXT_CONFIG_PROPERTY = "core.servletContextConfigLocation";

	private static final String ERROR_PAGE = "/dorado/ErrorPage";

	private static Log logger = LogFactory.getLog(DoradoServlet.class);

	@Override
	protected WebApplicationContext createWebApplicationContext(WebApplicationContext parent) throws BeansException {
		try {
			String contextConfigLocation = Configure.getString(SERVLET_CONTEXT_CONFIG_PROPERTY);

			// Separate XML locations from Java config class names
			List<String> xmlLocations = new ArrayList<>();
			List<Class<?>> javaConfigClasses = new ArrayList<>();
			if (contextConfigLocation != null) {
				for (String location : contextConfigLocation.split("[;,]")) {
					location = location.trim();
					if (location.isEmpty()) {
						continue;
					}
					if (isJavaConfigClass(location)) {
						try {
							javaConfigClasses.add(Class.forName(location));
						}
						catch (ClassNotFoundException e) {
							logger.warn("Java config class not found: " + location);
						}
					}
					else {
						xmlLocations.add(location);
					}
				}
			}

			ConsoleUtils.outputLoadingInfo("Loading servlet context configures...");

			// Use AnnotationConfigWebApplicationContext to support both XML and Java configs
			AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
			if (parent != null) {
				ctx.setParent(parent);
			}
			ctx.setServletContext(getServletContext());

			// Set XML config locations
			if (!xmlLocations.isEmpty()) {
				ctx.setConfigLocation(String.join(";", xmlLocations));
			}

			// Register Java @Configuration classes before refresh
			if (!javaConfigClasses.isEmpty()) {
				ctx.register(javaConfigClasses.toArray(new Class<?>[0]));
			}

			ctx.refresh();
			return ctx;
		}
		catch (Exception e) {
			logger.error(e, e);
			return super.createWebApplicationContext(parent);
		}
	}

	private static boolean isJavaConfigClass(String location) {
		if (location.startsWith("classpath:") || location.startsWith("file:") || location.endsWith(".xml")) {
			return false;
		}
		if (location.contains("/") || location.contains("*") || location.contains("?")) {
			return false;
		}
		try {
			Class.forName(location.trim());
			return true;
		}
		catch (ClassNotFoundException e) {
			return false;
		}
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);

		try {
			DoradoLoader doradoLoader = DoradoLoader.getInstance();
			doradoLoader.load(getServletContext());

			// System.gc();
			// Runtime runtime = Runtime.getRuntime();
			// System.out.println("freeMemory:" + runtime.freeMemory());
			// System.out.println("totalMemory:" + runtime.totalMemory());

			WebApplicationContext wac = getWebApplicationContext();
			RemovableBeanUtils.destroyRemovableBeans(wac);

			// System.gc();
			// System.out.println("freeMemory:" + runtime.freeMemory());
			// System.out.println("totalMemory:" + runtime.totalMemory());
		}
		catch (Exception e) {
			logger.error(e, e);
		}
	}

	@Override
	protected View resolveViewName(String viewName, Map<String, Object> model, Locale locale,
			HttpServletRequest request) throws Exception {
		if (ERROR_PAGE.equals(viewName)) {
			return new ErrorPageView();
		}
		else {
			return super.resolveViewName(viewName, model, locale, request);
		}
	}

	@Override
	protected HttpServletRequest checkMultipart(HttpServletRequest request) throws MultipartException {
		String servletName = request.getServletPath();
		if (!"/dorado".equals(servletName)) {
			return super.checkMultipart(request);
		}
		else {
			return request;
		}
	}

}