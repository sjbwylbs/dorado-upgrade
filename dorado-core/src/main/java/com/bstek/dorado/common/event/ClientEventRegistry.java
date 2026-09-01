package com.bstek.dorado.common.event;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.annotation.ClientEvents;
import com.bstek.dorado.common.ClientType;

/**
 * 客户端事件的注册管理器。
 *
 */
public class ClientEventRegistry {

	private static Map<Class<?>, Map<String, ClientEventRegisterInfo>> typeMap = new HashMap<>();

	private static Map<Class<?>, Map<String, ClientEventRegisterInfo>> typeMapCache = new HashMap<>();

	private static Set<Class<?>> processedTypes = new HashSet<>();

	private static Map<String, ClientEventRegisterInfo> EMPTY_MAP = Collections.emptyMap();

	/**
	 * 注册一个客户端事件。
	 * @param clientEventRegisterInfo 客户端事件的注册信息
	 */
	public static void registerClientEvent(ClientEventRegisterInfo clientEventRegisterInfo) {
		Class<?> type = clientEventRegisterInfo.getType();
		if (type == null) {
			throw new NullPointerException("[type] should not be null.");
		}

		Map<String, ClientEventRegisterInfo> eventMap = typeMap.get(type);
		if (eventMap == null) {
			eventMap = new HashMap<>();
			typeMap.put(type, eventMap);
		}

		String eventName = clientEventRegisterInfo.getName();
		if (StringUtils.isEmpty(eventName)) {
			throw new IllegalArgumentException("[eventName] should not be empty.");
		}

		if (eventMap.containsKey(eventName)) {
			throw new IllegalArgumentException(
					"Client event [" + type.getName() + "," + eventName + "] is already registered.");
		}

		eventMap.put(eventName, clientEventRegisterInfo);
	}

	public static Map<String, ClientEventRegisterInfo> getOwnClientEventRegisterInfos(Class<?> type) {
		collectClientEventRegisterInfosFromSingleType(type);
		return typeMap.get(type);
	}

	private static void collectClientEventRegisterInfos(Map<String, ClientEventRegisterInfo> eventMap, Class<?> type) {
		Class<?> superType = type.getSuperclass();
		if (superType != null) {
			collectClientEventRegisterInfos(eventMap, superType);
		}

		Class<?>[] interfaces = type.getInterfaces();
		for (Class<?> interfaceType : interfaces) {
			collectClientEventRegisterInfos(eventMap, interfaceType);
		}

		collectClientEventRegisterInfosFromSingleType(type);

		Map<String, ClientEventRegisterInfo> selfEventMap = typeMap.get(type);
		if (selfEventMap != null) {
			eventMap.putAll(selfEventMap);
		}
	}

	protected static void collectClientEventRegisterInfosFromSingleType(Class<?> type) {
		if (!processedTypes.contains(type)) {
			processedTypes.add(type);

			ClientEvents clientEvents = type.getAnnotation(ClientEvents.class);
			if (clientEvents != null && clientEvents.value() != null) {
				for (com.bstek.dorado.annotation.ClientEvent clientEvent : clientEvents.value()) {
					String[] signature = clientEvent.signature();
					if (signature.length == 1 && StringUtils.isEmpty(signature[0])) {
						signature = null;
					}
					ClientEventRegisterInfo clientEventRegisterInfo = new ClientEventRegisterInfo(type,
							clientEvent.name(), signature);
					clientEventRegisterInfo.setDeprecated(clientEvent.deprecated());

					int clientTypes = ClientType.parseClientTypes(clientEvent.clientTypes());
					if (clientTypes > 0) {
						clientEventRegisterInfo.setClientTypes(clientTypes);
					}

					ClientEventRegistry.registerClientEvent(clientEventRegisterInfo);
				}
			}
		}
	}

	/**
	 * 根据事件宿主的Class类型返回所有其支持的客户端事件的注册信息。
	 * @param type 事件宿主的Class类型
	 * @return 客户端事件注册信息的Map集合。其中Map集合的键为事件名，值为相应的事件注册信息。
	 */
	public static Map<String, ClientEventRegisterInfo> getClientEventRegisterInfos(
			Class<? extends ClientEventSupported> type) {
		synchronized (type) {
			Map<String, ClientEventRegisterInfo> eventMap = typeMapCache.get(type);
			if (eventMap == null) {
				eventMap = new HashMap<>();
				collectClientEventRegisterInfos(eventMap, type);
				eventMap = (eventMap.isEmpty()) ? EMPTY_MAP : Collections.unmodifiableMap(eventMap);
				typeMapCache.put(type, eventMap);
			}
			return eventMap;
		}
	}

	/**
	 * 根据事件宿主的Class类型和事件名返回相应的事件的注册信息。
	 * @param type 事件宿主的Class类型
	 * @param eventName 事件名
	 * @return 事件注册信息
	 */
	public static ClientEventRegisterInfo getClientEventRegisterInfo(Class<? extends ClientEventSupported> type,
			String eventName) {
		Map<String, ClientEventRegisterInfo> eventMap = getClientEventRegisterInfos(type);
		return (eventMap != null) ? eventMap.get(eventName) : null;
	}

}
