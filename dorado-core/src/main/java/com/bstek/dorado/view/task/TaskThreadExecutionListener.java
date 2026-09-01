package com.bstek.dorado.view.task;

public interface TaskThreadExecutionListener {

	void onSuccess(LongTaskThread taskThread, Object result);

	void onFailure(LongTaskThread taskThread, Exception e);

	void onAbort(LongTaskThread taskThread);

}
