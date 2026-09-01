package com.bstek.dorado.view.task;

import com.bstek.dorado.view.socket.Message;

public interface TaskMessageListener {

	void onStateChange(LongTask task, TaskStateInfo state);

	void onLogAppend(LongTask task, TaskLog log);

	void onSendMessage(LongTask task, Message message);

}
