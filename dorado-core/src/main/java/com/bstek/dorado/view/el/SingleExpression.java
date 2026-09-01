package com.bstek.dorado.view.el;

import org.apache.commons.jexl3.JexlExpression;

import com.bstek.dorado.core.el.EvaluateMode;

public class SingleExpression extends com.bstek.dorado.core.el.SingleExpression implements PrevaluateExpression {

	public SingleExpression(JexlExpression expression) {
		super(expression);
	}

	public SingleExpression(JexlExpression expression, EvaluateMode evaluateMode) {
		super(expression, evaluateMode);
	}

	@Override
	protected Object internalEvaluate() {
		if (this.getEvaluateMode() != EvaluateMode.onInstantiate
				&& OutputableExpressionUtils.isOutputableExpressionDisabled()) {
			OutputableExpressionUtils.setSkipedExpression(this);
			return null;
		}
		else {
			return super.internalEvaluate();
		}
	}

	@Override
	public Object prevaluate() {
		return getExpression().getSourceText();
	}

}
