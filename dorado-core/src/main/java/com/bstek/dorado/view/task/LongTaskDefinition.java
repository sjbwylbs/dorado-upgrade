package com.bstek.dorado.view.task;

public class LongTaskDefinition {

	private String name;

	private String schedular;

	private LongTaskScope scope = LongTaskScope.session;

	private int maxRunning = 0;

	private int maxWaiting = Integer.MAX_VALUE;

	public LongTaskDefinition(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public String getSchedular() {
		return schedular;
	}

	public void setSchedular(String schedular) {
		this.schedular = schedular;
	}

	public LongTaskScope getScope() {
		return scope;
	}

	public void setScope(LongTaskScope scope) {
		this.scope = scope;
	}

	public int getMaxRunning() {
		return maxRunning;
	}

	public void setMaxRunning(int maxRunning) {
		this.maxRunning = maxRunning;
	}

	public int getMaxWaiting() {
		return maxWaiting;
	}

	public void setMaxWaiting(int maxWaiting) {
		this.maxWaiting = maxWaiting;
	}

}
