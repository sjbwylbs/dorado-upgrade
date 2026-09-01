package com.bstek.dorado.view.el;

import java.util.List;

import com.bstek.dorado.core.el.DefaultExpressionHandler;
import com.bstek.dorado.core.el.EvaluateMode;
import com.bstek.dorado.core.el.Expression;

public class ViewExpressionHandler extends DefaultExpressionHandler {

	@Override
	protected Expression createExpression(List<Object> sections, EvaluateMode evaluateMode) {
		boolean hasOutputableExpression = false;
		for (Object section : sections) {
			if (section == null) {
				continue;
			}
			if (section instanceof Expression) {
				String expression = ((Expression) section).getSourceText();
				if (expression.startsWith("this.") || expression.equals("this")) {
					hasOutputableExpression = true;
					break;
				}
			}
		}

		if (hasOutputableExpression) {
			Expression expression;
			if (sections.size() == 1) {
				expression = new SingleExpression(
						(org.apache.commons.jexl3.JexlExpression) sections.get(0), evaluateMode);

			}
			else {
				expression = new CombinedExpression(sections, evaluateMode);
			}
			return expression;
		}
		else {
			return super.createExpression(sections, evaluateMode);
		}
	}

}
