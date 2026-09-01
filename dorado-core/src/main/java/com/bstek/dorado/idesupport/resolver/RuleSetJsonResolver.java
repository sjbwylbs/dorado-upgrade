package com.bstek.dorado.idesupport.resolver;

import java.io.PrintWriter;

import org.springframework.http.CacheControl;

import com.bstek.dorado.idesupport.RuleTemplateBuilder;
import com.bstek.dorado.idesupport.RuleTemplateManager;
import com.bstek.dorado.idesupport.output.RuleSetJsonOutputter;
import com.bstek.dorado.web.resolver.AbstractTextualResolver;
import com.bstek.dorado.web.resolver.HttpConstants;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class RuleSetJsonResolver extends AbstractTextualResolver {

	private RuleTemplateBuilder ruleTemplateBuilder;

	private RuleSetJsonOutputter ruleSetOutputter;

	public RuleSetJsonResolver() {
		setContentType(HttpConstants.CONTENT_TYPE_JAVASCRIPT);
		setCacheControl(CacheControl.noCache());
	}

	public void setRuleTemplateBuilder(RuleTemplateBuilder ruleTemplateBuilder) {
		this.ruleTemplateBuilder = ruleTemplateBuilder;
	}

	public void setRuleSetOutputter(RuleSetJsonOutputter ruleSetOutputter) {
		this.ruleSetOutputter = ruleSetOutputter;
	}

	@Override
	public void execute(HttpServletRequest request, HttpServletResponse response) throws Exception {
		RuleTemplateManager ruleTemplateManager = ruleTemplateBuilder.getRuleTemplateManager();
		PrintWriter writer = getWriter(request, response);
		try {
			ruleSetOutputter.output(writer, ruleTemplateManager);
		}
		finally {
			writer.flush();
			writer.close();
		}
	}

}
