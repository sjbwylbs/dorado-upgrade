package com.bstek.dorado.view.task;

public class TaskStateInfo extends AbstractTaskMessage {

	private TaskState state = TaskState.waiting;

	public TaskStateInfo() {
	}

	public TaskStateInfo(TaskState state) {
		setState(state);
	}

	public TaskStateInfo(TaskState state, String text) {
		this(state);
		setText(text);
	}

	public TaskStateInfo(TaskState state, Object data) {
		this(state);
		setData(data);
	}

	public TaskStateInfo(TaskState state, String text, Object data) {
		this(state, text);
		setData(data);
	}

	public TaskState getState() {
		return state;
	}

	public void setState(TaskState state) {
		this.state = state;
	}

}
