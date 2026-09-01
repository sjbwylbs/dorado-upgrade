package com.bstek.dorado.view.task;

public abstract class AbstractTaskMessage {

	private long timestamp = System.currentTimeMillis();

	private String text;

	private Object data;

	public long getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

}
