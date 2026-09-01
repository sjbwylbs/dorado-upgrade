package com.bstek.dorado.common.event;

import com.bstek.dorado.config.definition.ObjectDefinition;

/**
 * 客户端事件的配置声明对象。
 *
 */
public class ClientEventDefinition extends ObjectDefinition {

	private String name;

	public ClientEventDefinition() {
		setImplType(DefaultClientEvent.class);
	}

	/**
	 * 返回事件名
	 */
	public String getName() {
		return name;
	}

	/**
	 * 设置事件名
	 */
	public void setName(String name) {
		this.name = name;
	}

	public String getSignature() {
		return (String) getProperty("signature");
	}

	public void setSignature(String signature) {
		setProperty("signature", signature);
	}

	/**
	 * 返回事件体的脚本。
	 */
	public Object getScript() {
		return getProperty("script");
	}

	/**
	 * 设置事件体的脚本。
	 */
	public void setScript(Object script) {
		setProperty("script", script);
	}

}
