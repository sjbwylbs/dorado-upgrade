package com.bstek.dorado.data.config;

import com.bstek.dorado.core.el.EvaluateMode;
import com.bstek.dorado.core.el.Expression;
import com.bstek.dorado.data.type.DataType;

/**
 * 支持对运算结果进行数据类型转换的EL表达式。
 *
 */
public class DataTypeSupportedExpression implements Expression {

	private DataType dataType;

	private Expression expression;

	/**
	 * @param dataType 目标数据类型
	 * @param expression 原EL表达式对象
	 */
	public DataTypeSupportedExpression(DataType dataType, Expression expression) {
		this.dataType = dataType;
		this.expression = expression;
	}

	@Override
	public EvaluateMode getEvaluateMode() {
		return expression.getEvaluateMode();
	}

	@Override
	public Object evaluate() {
		Object value = expression.evaluate();
		if (dataType != null) {
			value = dataType.fromObject(value);
		}
		return value;
	}

	@Override
	public String getSourceText() {
		return expression.getSourceText();
	}

}
