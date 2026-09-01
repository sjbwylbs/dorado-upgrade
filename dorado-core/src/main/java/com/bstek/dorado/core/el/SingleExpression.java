package com.bstek.dorado.core.el;

import org.apache.commons.jexl3.JexlExpression;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.util.Assert;

/**
 * 单独的EL表达式的描述对象。
 *
 * @see org.apache.commons.jexl.JexlExpression
 */
public class SingleExpression extends AbstractExpression {

	private static final Log logger = LogFactory.getLog(SingleExpression.class);

	private JexlExpression expression;

	public SingleExpression() {
	}

	/**
	 * @param expression Jexl的表达式对象。
	 */
	public SingleExpression(JexlExpression expression) {
		Assert.notNull(expression);
		this.expression = expression;
	}

	/**
	 * @param expression
	 * @param evaluateMode
	 */
	public SingleExpression(JexlExpression expression, EvaluateMode evaluateMode) {
		this(expression);
		setEvaluateMode(evaluateMode);
	}

	/**
	 * 返回Jexl的表达式对象。
	 */
	public JexlExpression getExpression() {
		return expression;
	}

	@Override
	protected Object internalEvaluate() {
		try {
			Object value = internalEvaluateExpression(expression, getJexlContext());
			return value;
		}
		catch (Exception e) {
			logger.warn(e, e);
			return null;
		}
	}

	@Override
	public String getSourceText() {
		return expression.getSourceText();
	}

	@Override
	public int hashCode() {
		return expression.getSourceText().hashCode();
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof SingleExpression) {
			return ((SingleExpression) obj).expression.getSourceText().equals(expression.getSourceText());
		}
		else {
			return false;
		}
	}

	@Override
	public String toString() {
		StringBuffer sb = new StringBuffer();
		if (getEvaluateMode() == EvaluateMode.onRead) {
			sb.append('$');
		}
		sb.append("${").append(expression.getSourceText()).append('}');
		return sb.toString();
	}

}
