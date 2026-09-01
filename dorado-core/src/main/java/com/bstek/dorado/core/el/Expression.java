package com.bstek.dorado.core.el;

/**
 * 用于EL表达式的通用接口。
 *
 */
public interface Expression {

	/**
	 * @return
	 */
	EvaluateMode getEvaluateMode();

	/**
	 * 对表达式进行求值，返回其结果。
	 */
	Object evaluate();

	/**
	 * 返回表达式的源文本。
	 */
	String getSourceText();

}
