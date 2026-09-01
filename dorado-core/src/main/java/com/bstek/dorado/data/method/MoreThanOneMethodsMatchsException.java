package com.bstek.dorado.data.method;

public class MoreThanOneMethodsMatchsException extends MethodAutoMatchingException {

	private static final long serialVersionUID = 1L;

	/**
	 * @param message 错误信息
	 */
	public MoreThanOneMethodsMatchsException(String header, String detail) {
		super(header, detail);
	}

}
