package com.bstek.dorado.view.socket;

public abstract class SocketServerThread extends Thread {

	private Socket socket;

	public SocketServerThread(Socket socket) {
		setDaemon(true);
		this.socket = socket;
	}

	@Override
	public final void run() {
		run(socket);
	}

	protected abstract void run(Socket socket);

}
