package com.bstek.dorado.view.task;

import java.util.Set;

import com.bstek.dorado.web.DoradoContext;

public interface TaskScheduler {

	void setTaskDefinition(LongTaskDefinition taskDefinition);

	void queueTask(DoradoContext context, LongTaskThread taskThread);

	boolean dequeueTask(DoradoContext context, LongTaskThread taskThread);

	Set<LongTaskThread> getRunningTasks();

	Set<LongTaskThread> getWaitingTasks();

}