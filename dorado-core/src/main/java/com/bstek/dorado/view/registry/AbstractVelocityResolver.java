package com.bstek.dorado.view.registry;

import java.io.PrintWriter;

import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.Template;
import org.springframework.http.CacheControl;

import com.bstek.dorado.view.resolver.VelocityHelper;
import com.bstek.dorado.web.resolver.AbstractTextualResolver;
import com.bstek.dorado.web.resolver.HttpConstants;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public abstract class AbstractVelocityResolver extends AbstractTextualResolver {

	private VelocityHelper velocityHelper;

	private String pageTemplate;

	public AbstractVelocityResolver() {
		setContentType(HttpConstants.CONTENT_TYPE_HTML);
		setCacheControl(CacheControl.noCache());
	}

	public void setVelocityHelper(VelocityHelper velocityHelper) {
		this.velocityHelper = velocityHelper;
	}

	public VelocityHelper getVelocityHelper() {
		return velocityHelper;
	}

	public String getPageTemplate() {
		return pageTemplate;
	}

	public void setPageTemplate(String pageTemplate) {
		this.pageTemplate = pageTemplate;
	}

	@Override
	public void execute(HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (StringUtils.isBlank(pageTemplate)) {
			throw new IllegalArgumentException("'pageTemplate' undefined.");
		}

		org.apache.velocity.context.Context velocityContext = velocityHelper.getContext(null, request, response);
		initVelocityContext(velocityContext, request, response);

		Template template = velocityHelper.getVelocityEngine().getTemplate(pageTemplate);
		PrintWriter writer = getWriter(request, response);
		try {
			template.merge(velocityContext, writer);
		}
		finally {
			writer.flush();
			writer.close();
		}
	}

	protected abstract void initVelocityContext(org.apache.velocity.context.Context velocityContext,
			HttpServletRequest request, HttpServletResponse response) throws Exception;

}
