package com.bstek.dorado.web.resolver;

import java.io.FileNotFoundException;

public class PageNotFoundException extends FileNotFoundException {

	private static final long serialVersionUID = -7660289430597209704L;

	public PageNotFoundException(String message) {
		super(message);
	}

	public PageNotFoundException(Throwable cause) {
		this(cause.getMessage());
		this.initCause(cause);
	}

	public PageNotFoundException(String message, Throwable cause) {
		this(message);
		this.initCause(cause);
	}

}
