package com.bstek.dorado.view.longpolling;

import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import com.bstek.dorado.view.socket.AbstractSocket;
import com.bstek.dorado.view.socket.Message;
import com.bstek.dorado.view.socket.SocketSendListener;

public class LongPollingSocket extends AbstractSocket {

	private String id = UUID.randomUUID().toString();

	private boolean connected = true;

	private long lastAccess;

	private long responseDelay = -1;

	private BlockingQueue<Message> inQueue = new LinkedBlockingQueue<>();

	private BlockingQueue<Message> outQueue = new LinkedBlockingQueue<>();

	public LongPollingSocket() {
		updateLastAccess();
	}

	public long getLastAccess() {
		return lastAccess;
	}

	public void updateLastAccess() {
		lastAccess = System.currentTimeMillis();
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public boolean isConnected() {
		return connected;
	}

	public long getResponseDelay() {
		return responseDelay;
	}

	public void setResponseDelay(long responseDelay) {
		this.responseDelay = responseDelay;
	}

	@Override
	public synchronized void addSendListener(SocketSendListener listener) {
		super.addSendListener(listener);

		try {
			while (!outQueue.isEmpty()) {
				send(outQueue.remove());
			}
		}
		catch (Exception e) {
			// do nothing
		}
	}

	@Override
	public void send(Message message) throws Exception {
		if (!fireSend(message)) {
			outQueue.offer(message);
		}
	}

	public void push(Message message) {
		if (!fireReceive(message)) {
			inQueue.offer(message);
		}
	}

	@Override
	public Message receive() throws Exception {
		Message message = inQueue.take();
		if (message == Message.TERMINATE_MESSAGE) {
			return null;
		}
		else {
			updateLastAccess();
			fireReceive(message);
			return message;
		}
	}

	@Override
	public void disconnect() throws Exception {
		disconnect(true);
	}

	public void disconnect(boolean sendTerminateMessage) throws Exception {
		connected = false;
		outQueue.clear();
		inQueue.clear();
		if (sendTerminateMessage) {
			inQueue.offer(Message.TERMINATE_MESSAGE);
		}
		fireDisconnect();
	}

}
