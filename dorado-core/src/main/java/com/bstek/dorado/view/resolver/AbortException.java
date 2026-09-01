package com.bstek.dorado.view.resolver;

/**
 * 这是一个特殊的异常对象，用于通知系统放弃当前的操作。该异常是哑异常，抛出后不会带来任何默认的异常提示。
 *
 */
public class AbortException extends RuntimeException {

	private static final long serialVersionUID = -2383202097188173960L;

	public AbortException() {
		super();
	}

	public AbortException(String message, Throwable cause) {
		super(message, cause);
	}

	public AbortException(String message) {
		super(message);
	}

	public AbortException(Throwable cause) {
		super(cause);
	}

}
