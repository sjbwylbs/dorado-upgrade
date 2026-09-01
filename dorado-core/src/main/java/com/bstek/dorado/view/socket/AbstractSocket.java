package com.bstek.dorado.view.socket;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractSocket implements Socket {

	private List<SocketSendListener> sendListeners;

	private List<SocketReceiveListener> receiveListeners;

	private List<SocketConnectionListener> connectionListeners;

	private Object bindingObject;

	public Object getBindingObject() {
		return bindingObject;
	}

	public void setBindingObject(Object bindingObject) {
		this.bindingObject = bindingObject;
	}

	@Override
	public synchronized void addSendListener(SocketSendListener listener) {
		if (sendListeners == null) {
			sendListeners = new ArrayList<>();
		}
		sendListeners.add(listener);
	}

	@Override
	public synchronized void removeSendListener(SocketSendListener listener) {
		if (sendListeners != null) {
			sendListeners.remove(listener);
		}
	}

	@Override
	public synchronized void addReceiveListener(SocketReceiveListener listener) {
		if (receiveListeners == null) {
			receiveListeners = new ArrayList<>();
		}
		receiveListeners.add(listener);
	}

	@Override
	public synchronized void removeReceiveListener(SocketReceiveListener listener) {
		if (receiveListeners != null) {
			receiveListeners.remove(listener);
		}
	}

	@Override
	public synchronized void addConnectionListener(SocketConnectionListener listener) {
		if (connectionListeners == null) {
			connectionListeners = new ArrayList<>();
		}
		connectionListeners.add(listener);
	}

	@Override
	public synchronized void removeConnectionListener(SocketConnectionListener listener) {
		if (connectionListeners != null) {
			connectionListeners.remove(listener);
		}
	}

	protected boolean fireSend(Message message) {
		boolean hasListener = false;
		if (sendListeners != null) {
			for (SocketSendListener listener : sendListeners.toArray(new SocketSendListener[0])) {
				hasListener = true;
				listener.onSend(this, message);
			}
		}
		return hasListener;
	}

	protected boolean fireReceive(Message message) {
		boolean hasListener = false;
		if (receiveListeners != null) {
			for (SocketReceiveListener listener : receiveListeners.toArray(new SocketReceiveListener[0])) {
				hasListener = true;
				listener.onReceive(this, message);
			}
		}
		return hasListener;
	}

	protected boolean fireDisconnect() {
		boolean hasListener = false;
		if (connectionListeners != null) {
			for (SocketConnectionListener listener : connectionListeners.toArray(new SocketConnectionListener[0])) {
				hasListener = true;
				listener.onDisconnect(this);
			}
		}
		return hasListener;
	}

}
