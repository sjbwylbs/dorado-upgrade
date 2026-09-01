package com.bstek.dorado.view.el;

import java.util.Map;

import com.bstek.dorado.core.el.ContextVarsInitializer;
import com.bstek.dorado.view.config.definition.AssembledComponentExpressionObject;

public class ViewContextVarsInitializer implements ContextVarsInitializer {

	@Override
	public void initializeContext(Map<String, Object> vars) {
		vars.put("res", new ResourceExpressionHandler());
		vars.put("acomp", new AssembledComponentExpressionObject(null));
	}

}
