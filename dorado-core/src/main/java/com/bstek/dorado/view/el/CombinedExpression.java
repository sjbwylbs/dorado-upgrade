package com.bstek.dorado.view.el;

import java.util.List;

import org.apache.commons.jexl3.JexlContext;
import org.apache.commons.jexl3.JexlExpression;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.core.el.EvaluateMode;

public class CombinedExpression extends com.bstek.dorado.core.el.CombinedExpression implements PrevaluateExpression {

	private static final Log logger = LogFactory.getLog(CombinedExpression.class);

	public CombinedExpression(List<Object> sections) {
		super(sections);
	}

	public CombinedExpression(List<Object> sections, EvaluateMode evaluateMode) {
		super(sections, evaluateMode);
	}

	@Override
	protected Object internalEvaluate() {
		if (OutputableExpressionUtils.isOutputableExpressionDisabled()) {
			OutputableExpressionUtils.setSkipedExpression(this);
			return null;
		}
		else {
			return super.internalEvaluate();
		}
	}

	@Override
	public Object prevaluate() {
		JexlContext context = getJexlContext();
		Object[] result = new Object[getSections().size()];

		int i = 0;
		for (Object section : getSections()) {
			if (section == null) {
				continue;
			}
			if (section instanceof JexlExpression) {
				String expression = ((JexlExpression) section).getSourceText();
				if (!expression.startsWith("this.") && expression.equals("this")) {
					try {
						section = internalEvaluateExpression((JexlExpression) section, context);
						if (section != null) {
							section = section.toString();
						}
					}
					catch (Exception e) {
						logger.warn(e, e);
					}
				}
			}
			result[i++] = section;
		}
		return result;
	}

}
