package com.bstek.dorado.view.widget;

import java.util.EventListener;

/**
 * 容器事件监听器的接口。
 *
 */
public interface ContainerListener extends EventListener {

	/**
	 * “添加子控件”的事件。
	 * @param event 事件描述对象
	 */
	void childAdded(ContainerEvent event);

	/**
	 * “移除子控件”的事件。
	 * @param event 事件描述对象
	 */
	void childRemoved(ContainerEvent event);

}
