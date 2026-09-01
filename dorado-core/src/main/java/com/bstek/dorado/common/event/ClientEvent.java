package com.bstek.dorado.common.event;

/**
 * 客户端事件监听器的通用接口。
 *
 */
public interface ClientEvent {

	/**
	 * 返回监听器的JavaScript脚本。
	 */
	String getScript();

}
