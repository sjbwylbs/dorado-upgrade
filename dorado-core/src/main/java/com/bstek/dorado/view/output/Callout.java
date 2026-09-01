package com.bstek.dorado.view.output;

public class Callout {

	private String id;

	private Object object;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Object getObject() {
		return object;
	}

	public void setObject(Object object) {
		this.object = object;
	}

	public Outputter getOutputter() {
		return Outputter;
	}

	public void setOutputter(Outputter outputter) {
		Outputter = outputter;
	}

	private Outputter Outputter;

}
