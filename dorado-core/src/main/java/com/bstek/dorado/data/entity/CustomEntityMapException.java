package com.bstek.dorado.data.entity;

public class CustomEntityMapException extends RuntimeException {

	private static final long serialVersionUID = -1194969252136814261L;

	public CustomEntityMapException(String message, Throwable cause) {
		super(message, cause);
	}

	public CustomEntityMapException(Throwable cause) {
		super(cause);
	}

}
