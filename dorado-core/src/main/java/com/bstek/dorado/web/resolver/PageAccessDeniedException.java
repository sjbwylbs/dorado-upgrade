package com.bstek.dorado.web.resolver;

public class PageAccessDeniedException extends IllegalAccessException {

	private static final long serialVersionUID = -2047396921354715436L;

	public PageAccessDeniedException(String message) {
		super(message);
	}

	public PageAccessDeniedException(Throwable cause) {
		this(cause.getMessage());
		this.initCause(cause);
	}

	public PageAccessDeniedException(String message, Throwable cause) {
		this(message);
		this.initCause(cause);
	}

}
