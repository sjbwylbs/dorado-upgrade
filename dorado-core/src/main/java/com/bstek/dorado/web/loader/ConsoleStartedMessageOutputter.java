package com.bstek.dorado.web.loader;

import java.io.Writer;

import com.bstek.dorado.spring.RemovableBean;

public abstract class ConsoleStartedMessageOutputter implements RemovableBean {

	private int order = 999;

	public int getOrder() {
		return order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

	public abstract void output(Writer writer) throws Exception;

}
