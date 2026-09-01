package com.bstek.dorado.data.provider.filter;

import com.bstek.dorado.data.type.DataType;

public class SingleValueFilterCriterion extends FilterCriterion {

	private DataType dataType;

	private String expression;

	private Object value;

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

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

}
