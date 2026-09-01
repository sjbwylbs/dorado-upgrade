package com.bstek.dorado.web.resolver;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.context.Context;
import org.apache.velocity.runtime.RuntimeConstants;
import org.springframework.web.servlet.view.AbstractUrlBasedView;

import com.bstek.dorado.core.Constants;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ErrorPageView extends AbstractUrlBasedView {

	private static Log logger = LogFactory.getLog(ErrorPageView.class);

	public static final String JAVAX_EXCEPTION_ATTRIBUTE = "javax.servlet.error.exception";

	public static final String VELOCITY_EXCEPTION_ATTRIBUTE = "exception";

	private VelocityEngine velocityEngine;

	private Properties velocityProperties;

	private StringEscapeHelper stringEscapeHelper = new StringEscapeHelper();

	public ErrorPageView() {
		setContentType(HttpConstants.CONTENT_TYPE_HTML);
	}

	private VelocityEngine getVelocityEngine() throws Exception {
		if (velocityEngine == null) {
			velocityEngine = new VelocityEngine();

			velocityProperties = new Properties();
			velocityProperties.setProperty(RuntimeConstants.INPUT_ENCODING, Constants.DEFAULT_CHARSET);
			velocityProperties.setProperty("output.encoding", Constants.DEFAULT_CHARSET);
			velocityProperties.setProperty("file.resource.loader.class",
					"org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
			velocityEngine.init(velocityProperties);
		}
		return velocityEngine;
	}

	protected PrintWriter getWriter(HttpServletRequest request, HttpServletResponse response) throws IOException {
		OutputStream out = response.getOutputStream();
		return new PrintWriter(new OutputStreamWriter(out, Constants.DEFAULT_CHARSET));
	}

	private void doRender(HttpServletRequest request, HttpServletResponse response) throws Exception, IOException {
		response.setContentType(getContentType());
		response.setCharacterEncoding(Constants.DEFAULT_CHARSET);

		Context velocityContext = new VelocityContext();
		Exception e = (Exception) request.getAttribute(JAVAX_EXCEPTION_ATTRIBUTE);
		if (e != null) {
			if (e instanceof PageNotFoundException) {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			}
			else if (e instanceof PageAccessDeniedException) {
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			}

			Throwable t = e;
			while (t instanceof InvocationTargetException && t.getCause() != null) {
				t = t.getCause();
			}

			String message = t.getMessage();

			while (t.getCause() != null) {
				t = t.getCause();
			}

			if (StringUtils.isEmpty(message)) {
				message = t.getClass().getSimpleName();
			}

			velocityContext.put("message", message);
			velocityContext.put(VELOCITY_EXCEPTION_ATTRIBUTE, t);

			logger.error(message, t);
		}
		else {
			velocityContext.put("message", "Can not gain exception information!");
		}
		velocityContext.put("esc", stringEscapeHelper);

		Template template = getVelocityEngine().getTemplate("com/bstek/dorado/web/resolver/ErrorPage.html");

		PrintWriter writer = getWriter(request, response);
		try {
			template.merge(velocityContext, writer);
		}
		finally {
			writer.flush();
			writer.close();
		}
	}

	@Override
	protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		try {
			doRender(request, response);
		}
		catch (Throwable e) {
			// 确保不会因再次抛出异常而进入死锁状态

			Throwable t = e;
			while (t instanceof InvocationTargetException && t.getCause() != null) {
				t = t.getCause();
			}

			String message = t.getMessage();

			while (t.getCause() != null) {
				t = t.getCause();
			}

			if (StringUtils.isEmpty(message)) {
				message = t.getClass().getSimpleName();
			}

			logger.error(message, t);
		}
	}

}
