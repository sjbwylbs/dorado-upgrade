package com.bstek.dorado.view.widget.action;

import com.bstek.dorado.annotation.ClientProperty;

public abstract class AsyncAction extends Action {

	private boolean async = true;

	private boolean modal = true;

	private String executingMessage;

	@ClientProperty(escapeValue = "true")
	public boolean isAsync() {
		return async;
	}

	public void setAsync(boolean async) {
		this.async = async;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isModal() {
		return modal;
	}

	public void setModal(boolean modal) {
		this.modal = modal;
	}

	public String getExecutingMessage() {
		return executingMessage;
	}

	public void setExecutingMessage(String executingMessage) {
		this.executingMessage = executingMessage;
	}

}
