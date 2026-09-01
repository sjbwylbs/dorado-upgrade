package com.bstek.dorado.common.event;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用于实现单个对象对客户端事件的管理，简化事件管理的辅助类。
 *
 */
public class ClientEventHolder {

	private Class<? extends ClientEventSupported> ownerType;

	private Map<String, List<ClientEvent>> eventMap;

	/**
	 * @param ownerType 宿主对象的Class类型
	 */
	public ClientEventHolder(Class<? extends ClientEventSupported> ownerType) {
		this.ownerType = ownerType;
	}

	/**
	 * @param owner 宿主对象
	 */
	public ClientEventHolder(ClientEventSupported owner) {
		this(owner.getClass());
	}

	private List<ClientEvent> getClientEventListenersInternal(String eventName) {
		return (eventMap != null) ? eventMap.get(eventName) : null;
	}

	/**
	 * 添加一个事件监听器。
	 * @param eventName 事件名
	 * @param eventListener 事件监听器
	 */
	public void addClientEventListener(String eventName, ClientEvent eventListener) {
		checkEventAvailable(eventName);

		if (eventMap == null) {
			eventMap = new HashMap<>();
		}

		List<ClientEvent> events = getClientEventListenersInternal(eventName);
		if (events == null) {
			events = new ArrayList<>();
			eventMap.put(eventName, events);
		}
		events.add(eventListener);
	}

	protected void checkEventAvailable(String eventName) {
		ClientEventRegisterInfo clientEventRegisterInfo = ClientEventRegistry.getClientEventRegisterInfo(ownerType,
				eventName);
		if (clientEventRegisterInfo == null) {
			throw new IllegalArgumentException(
					"Unrecognized client event [" + ownerType.getName() + "," + eventName + "].");
		}
	}

	/**
	 * 根据事件名返回所有已添加的事件监听器。
	 * @param eventName 事件名
	 * @return 事件监听器的列表结合
	 */
	@SuppressWarnings("unchecked")
	public List<ClientEvent> getClientEventListeners(String eventName) {
		List<ClientEvent> events = getClientEventListenersInternal(eventName);
		if (events != null) {
			return events;
		}
		else {
			return Collections.EMPTY_LIST;
		}
	}

	/**
	 * 清除所有某事件中的监听器。
	 * @param eventName 事件名
	 */
	public void clearClientEventListeners(String eventName) {
		List<ClientEvent> events = getClientEventListenersInternal(eventName);
		if (events != null) {
			events.clear();
		}
	}

	/**
	 * 返回所有已添加的事件监听器。
	 * @return 包含各种事件下所有事件监听器的Map集合。
	 */
	@SuppressWarnings("unchecked")
	public Map<String, List<ClientEvent>> getAllClientEventListeners() {
		return (eventMap != null) ? eventMap : Collections.EMPTY_MAP;
	}

}
