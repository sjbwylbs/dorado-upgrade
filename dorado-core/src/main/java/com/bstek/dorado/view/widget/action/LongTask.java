package com.bstek.dorado.view.widget.action;

import com.bstek.dorado.annotation.ClientEvent;
import com.bstek.dorado.annotation.ClientEvents;
import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.view.annotation.Widget;


@Widget(name = "LongTask", category = "Action", dependsPackage = "base-widget", autoGenerateId = true)
@XmlNode(parser = "spring:dorado.longTaskParser")
@ClientObject(prototype = "dorado.widget.LongTask", shortTypeName = "LongTask")
@ClientEvents({ @ClientEvent(name = "onTaskScheduled"), @ClientEvent(name = "onTaskEnd"),
		@ClientEvent(name = "onStateChange"), @ClientEvent(name = "onLog") })
public class LongTask extends Action {

	private String taskName;

	private LongTaskAppearence appearence = LongTaskAppearence.daemonTask;

	private boolean disableOnActive = true;

	@IdeProperty(highlight = 1)
	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	@ClientProperty(escapeValue = "daemonTask")
	public LongTaskAppearence getAppearence() {
		return appearence;
	}

	public void setAppearence(LongTaskAppearence appearence) {
		this.appearence = appearence;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isDisableOnActive() {
		return disableOnActive;
	}

	public void setDisableOnActive(boolean disableOnActive) {
		this.disableOnActive = disableOnActive;
	}

}
