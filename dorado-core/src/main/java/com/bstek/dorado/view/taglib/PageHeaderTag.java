package com.bstek.dorado.view.taglib;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.view.View;
import com.bstek.dorado.view.resolver.PageOutputUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.jsp.JspException;
import jakarta.servlet.jsp.tagext.TagSupport;

public class PageHeaderTag extends TagSupport {

	private static final long serialVersionUID = 1505799261850356012L;

	private static final Log logger = LogFactory.getLog(PageHeaderTag.class);

	@Override
	public int doEndTag() throws JspException {
		try {
			View view = PageOutputUtils.getView((HttpServletRequest) pageContext.getRequest());
			PageOutputUtils.outputHeader(view, (HttpServletRequest) pageContext.getRequest(),
					(HttpServletResponse) pageContext.getResponse(), pageContext.getOut());
		}
		catch (Exception e) {
			logger.error(e, e);
			throw new JspException(e);
		}
		return super.doEndTag();
	}

}
