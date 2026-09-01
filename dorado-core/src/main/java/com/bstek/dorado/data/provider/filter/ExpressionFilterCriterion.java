package com.bstek.dorado.data.provider.filter;

import com.bstek.dorado.data.type.DataType;

public class ExpressionFilterCriterion extends FilterCriterion {

	private DataType dataType;

	private String expression;

	public DataType getDataType() {
		return dataType;
	}

	public void setDataType(DataType dataType) {
		this.dataType = dataType;
	}

	public String getExpression() {
		return expression;
	}

	public void setExpression(String expression) {
		this.expression = expression;
	}

}
