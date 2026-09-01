package com.bstek.dorado.uploader;

import jakarta.servlet.http.HttpServletResponse;

/**
 * 期望中止上传时抛出该异常，客户端触发OnError和OnFailue事件
 *
 *
 */
public class UploaderException extends RuntimeException {

	private static final long serialVersionUID = 6455565200058585749L;

	/**
	 * 错误状态码，默认值为500
	 */
	private int statusCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;

	public UploaderException() {

	}

	public UploaderException(String message, Throwable cause) {
		super(message, cause);
	}

	public UploaderException(String message) {
		super(message);
	}

	public UploaderException(Throwable cause) {
		super(cause);
	}

	public UploaderException(int statusCode) {
		this.statusCode = statusCode;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}
}
