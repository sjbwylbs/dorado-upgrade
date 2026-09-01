package com.bstek.dorado.idesupport.resolver;

import java.io.PrintWriter;

import org.springframework.http.CacheControl;

import com.bstek.dorado.idesupport.RuleSetBuilder;
import com.bstek.dorado.idesupport.RuleTemplateBuilder;
import com.bstek.dorado.idesupport.RuleTemplateManager;
import com.bstek.dorado.idesupport.output.ComputedRuleSetJsonOutputter;
import com.bstek.dorado.web.resolver.AbstractTextualResolver;
import com.bstek.dorado.web.resolver.HttpConstants;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ComputedRuleSetJsonResolver extends AbstractTextualResolver {

	private RuleTemplateBuilder ruleTemplateBuilder;

	private RuleSetBuilder ruleSetBuilder;

	private ComputedRuleSetJsonOutputter ruleSetOutputter;

	public ComputedRuleSetJsonResolver() {
		setContentType(HttpConstants.CONTENT_TYPE_JAVASCRIPT);
		setCacheControl(CacheControl.noCache());
	}

	public void setRuleTemplateBuilder(RuleTemplateBuilder ruleTemplateBuilder) {
		this.ruleTemplateBuilder = ruleTemplateBuilder;
	}

	public void setRuleSetBuilder(RuleSetBuilder ruleSetBuilder) {
		this.ruleSetBuilder = ruleSetBuilder;
	}

	public void setRuleSetOutputter(ComputedRuleSetJsonOutputter ruleSetOutputter) {
		this.ruleSetOutputter = ruleSetOutputter;
	}

	@Override
	public void execute(HttpServletRequest request, HttpServletResponse response) throws Exception {
		PrintWriter writer = getWriter(request, response);
		try {
			RuleTemplateManager ruleTemplateManager = ruleTemplateBuilder.getRuleTemplateManager();
			ruleSetOutputter.output(writer, ruleSetBuilder.buildRuleSet(ruleTemplateManager));
		}
		finally {
			writer.flush();
			writer.close();
		}
	}

}
