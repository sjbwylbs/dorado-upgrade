package com.bstek.dorado.view.socket;

public interface Socket {

	String getId();

	boolean isConnected();

	void send(Message message) throws Exception;

	Message receive() throws Exception;

	void disconnect() throws Exception;

	void addSendListener(SocketSendListener listener);

	void removeSendListener(SocketSendListener listener);

	void addReceiveListener(SocketReceiveListener listener);

	void removeReceiveListener(SocketReceiveListener listener);

	void addConnectionListener(SocketConnectionListener listener);

	void removeConnectionListener(SocketConnectionListener listener);

}
