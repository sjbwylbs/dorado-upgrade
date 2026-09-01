package com.bstek.dorado.view.type.property.validator;

public abstract class BaseValidator extends AbstractValidator {

	private String resultMessage;

	public String getResultMessage() {
		return resultMessage;
	}

	public void setResultMessage(String resultMessage) {
		this.resultMessage = resultMessage;
	}

}
