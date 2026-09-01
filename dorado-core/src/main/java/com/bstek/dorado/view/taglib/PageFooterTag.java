package com.bstek.dorado.view.taglib;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.view.View;
import com.bstek.dorado.view.resolver.PageOutputUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.jsp.JspException;
import jakarta.servlet.jsp.tagext.TagSupport;

public class PageFooterTag extends TagSupport {

	private static final long serialVersionUID = -8653129987997044081L;

	private static final Log logger = LogFactory.getLog(PageFooterTag.class);

	@Override
	public int doEndTag() throws JspException {
		try {
			View view = PageOutputUtils.getView((HttpServletRequest) pageContext.getRequest());
			PageOutputUtils.outputFooter(view, (HttpServletRequest) pageContext.getRequest(),
					(HttpServletResponse) pageContext.getResponse(), pageContext.getOut());
		}
		catch (Exception e) {
			logger.error(e, e);
			throw new JspException(e);
		}
		return super.doEndTag();
	}

}
