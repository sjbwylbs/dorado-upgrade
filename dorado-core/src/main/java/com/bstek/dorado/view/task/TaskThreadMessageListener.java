package com.bstek.dorado.view.task;

import com.bstek.dorado.view.socket.Message;

public interface TaskThreadMessageListener {

	void onStateChange(LongTaskThread taskThread, TaskStateInfo state);

	void onLogAppend(LongTaskThread taskThread, TaskLog log);

	void onSendMessage(LongTaskThread taskThread, Message message);

}
