package com.bstek.dorado.view.widget.action;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "AjaxAction", category = "Action", dependsPackage = "base-widget", autoGenerateId = true)
@XmlNode(parser = "spring:dorado.ajaxActionParser")
@ClientObject(prototype = "dorado.widget.AjaxAction", shortTypeName = "AjaxAction")
public class AjaxAction extends AsyncAction {

	private long timeout;

	private boolean batchable = true;

	private String service;

	private boolean supportsEntity = true;

	public long getTimeout() {
		return timeout;
	}

	public void setTimeout(long timeout) {
		this.timeout = timeout;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isBatchable() {
		return batchable;
	}

	public void setBatchable(boolean batchable) {
		this.batchable = batchable;
	}

	@IdeProperty(highlight = 1)
	public String getService() {
		return service;
	}

	public void setService(String service) {
		this.service = service;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isSupportsEntity() {
		return supportsEntity;
	}

	public void setSupportsEntity(boolean supportsEntity) {
		this.supportsEntity = supportsEntity;
	}

}
