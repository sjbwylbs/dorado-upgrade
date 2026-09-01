package com.bstek.dorado.config.xml;

public class StaticPropertyParser extends PropertyParser {

	@Override
	protected boolean shouldEvaluateExpression() {
		return true;
	}

}
