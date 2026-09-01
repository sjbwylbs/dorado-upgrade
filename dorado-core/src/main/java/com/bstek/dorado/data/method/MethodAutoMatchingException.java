package com.bstek.dorado.data.method;

/**
 * 当{@link com.bstek.dorado.data.method.MethodAutoMatchingUtils}
 * 找到了一个以上的匹配方法或没有找到任何匹配的方法将抛出的异常
 *
 */
public class MethodAutoMatchingException extends Exception {

	private static final long serialVersionUID = -1237977702030591321L;

	private String header;

	private String detail;

	/**
	 * @param message 错误信息
	 */
	public MethodAutoMatchingException(String header, String detail) {
		super(header + detail);
		this.header = header;
		this.detail = detail;
	}

	public String getHeader() {
		return header;
	}

	public void setHeader(String header) {
		this.header = header;
	}

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

}
