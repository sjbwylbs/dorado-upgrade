package com.bstek.dorado.core.el;

import org.apache.commons.jexl3.JexlContext;
import org.apache.commons.jexl3.JexlExpression;

/**
 * EL表达式的抽象实现类。
 *
 */
public abstract class AbstractExpression implements Expression, ExpressionHandlerAware {

	/**
	 * EL表达式的处理器。
	 */
	protected ExpressionHandler elHandler;

	private EvaluateMode evaluateMode = EvaluateMode.onInstantiate;

	@Override
	public void setExpressionHandler(ExpressionHandler elHandler) {
		this.elHandler = elHandler;
	}

	@Override
	public EvaluateMode getEvaluateMode() {
		return evaluateMode;
	}

	public void setEvaluateMode(EvaluateMode evaluateMode) {
		this.evaluateMode = evaluateMode;
	}

	/**
	 * 返回一个Jexl的上下文对象。
	 * <p>
	 * 由于Dorado内部通过apache提供的JEXL通过包来实现EL表达式的解析和求值等操作， 因此在对EL表达式进行求值前需要首先获得一个有效的Jexl上下文对象。
	 * </p>
	 */
	protected JexlContext getJexlContext() {
		return elHandler.getJexlContext();
	}

	@Override
	public final Object evaluate() {
		return internalEvaluate();
	}

	/**
	 * 内部的执行Jexl表达式的方法。
	 */
	protected abstract Object internalEvaluate();

	/**
	 * 返回表达式的源文本。
	 */
	@Override
	public abstract String getSourceText();

	/**
	 * 内部的执行Jexl表达式的方法。<br>
	 * 如果返回的结果值仍是一个表达式，将进一步对该表达式进行求值。
	 */
	protected Object internalEvaluateExpression(JexlExpression expression, JexlContext context) throws Exception {
		Object value = expression.evaluate(context);
		if (value != null && value instanceof Expression) {
			value = ((Expression) value).evaluate();
		}
		return value;
	}

}
