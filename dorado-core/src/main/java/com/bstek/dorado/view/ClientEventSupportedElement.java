package com.bstek.dorado.view;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bstek.dorado.common.event.ClientEvent;
import com.bstek.dorado.common.event.ClientEventHolder;
import com.bstek.dorado.common.event.ClientEventSupported;

public abstract class ClientEventSupportedElement extends AbstractViewElement implements ClientEventSupported {

	private ClientEventHolder clientEventHolder;

	private ClientEventHolder getClientEventHolder() {
		if (clientEventHolder == null) {
			clientEventHolder = createClientEventHolder();
		}
		return clientEventHolder;
	}

	protected ClientEventHolder createClientEventHolder() {
		return new ClientEventHolder(this);
	}

	@Override
	public void addClientEventListener(String eventName, ClientEvent eventListener) {
		getClientEventHolder().addClientEventListener(eventName, eventListener);
	}

	@Override
	public List<ClientEvent> getClientEventListeners(String eventName) {
		return (clientEventHolder != null) ? clientEventHolder.getClientEventListeners(eventName) : new ArrayList<>();
	}

	@Override
	public void clearClientEventListeners(String eventName) {
		if (clientEventHolder != null) {
			clientEventHolder.clearClientEventListeners(eventName);
		}
	}

	@Override
	public Map<String, List<ClientEvent>> getAllClientEventListeners() {
		return (clientEventHolder != null) ? clientEventHolder.getAllClientEventListeners() : new HashMap<>();
	}

}