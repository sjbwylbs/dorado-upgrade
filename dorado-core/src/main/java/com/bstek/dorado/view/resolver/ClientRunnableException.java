package com.bstek.dorado.view.resolver;

import org.apache.commons.lang3.StringUtils;

public class ClientRunnableException extends RuntimeException {

	private static final long serialVersionUID = 3478313367942463176L;

	private String script;

	public ClientRunnableException(String script) {
		this.script = script;
	}

	public ClientRunnableException(String message, String script) {
		super(message);
		this.script = script;
	}

	public String getScript() {
		return script;
	}

	@Override
	public String toString() {
		String message = getMessage();
		if (StringUtils.isEmpty(message)) {
			return script;
		}
		else {
			return super.toString();
		}
	}

}
