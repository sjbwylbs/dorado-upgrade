package com.bstek.dorado.common.event;

import java.util.List;
import java.util.Map;

public abstract class ClientEventSupportedObject implements ClientEventSupported {

	private ClientEventHolder clientEventHolder = new ClientEventHolder(this);

	@Override
	public void addClientEventListener(String eventName, ClientEvent eventListener) {
		clientEventHolder.addClientEventListener(eventName, eventListener);
	}

	@Override
	public List<ClientEvent> getClientEventListeners(String eventName) {
		return clientEventHolder.getClientEventListeners(eventName);
	}

	@Override
	public void clearClientEventListeners(String eventName) {
		clientEventHolder.clearClientEventListeners(eventName);
	}

	@Override
	public Map<String, List<ClientEvent>> getAllClientEventListeners() {
		return clientEventHolder.getAllClientEventListeners();
	}

}
