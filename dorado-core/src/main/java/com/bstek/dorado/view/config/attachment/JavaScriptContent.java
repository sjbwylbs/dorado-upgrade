package com.bstek.dorado.view.config.attachment;

import java.util.List;

public class JavaScriptContent {

	private Object content;

	private boolean isController;

	private List<FunctionInfo> functionInfos;

	public Object getContent() {
		return content;
	}

	public void setContent(Object content) {
		this.content = content;
	}

	public boolean getIsController() {
		return isController;
	}

	public void setIsController(boolean isController) {
		this.isController = isController;
	}

	public List<FunctionInfo> getFunctionInfos() {
		return functionInfos;
	}

	public void setFunctionInfos(List<FunctionInfo> functionInfos) {
		this.functionInfos = functionInfos;
	}

}
