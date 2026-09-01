package com.bstek.dorado.core.io;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class EmptyResource implements Resource {

	public static final EmptyResource INSTANCE = new EmptyResource();

	private EmptyResource() {
	}

	@Override
	public String getPath() {
		return null;
	}

	@Override
	public boolean exists() {
		return false;
	}

	@Override
	public long getTimestamp() throws IOException {
		return 0;
	}

	@Override
	public InputStream getInputStream() throws IOException {
		return null;
	}

	@Override
	public URL getURL() throws IOException {
		return null;
	}

	@Override
	public File getFile() throws IOException {
		return null;
	}

	@Override
	public Resource createRelative(String relativePath) throws IOException {
		return null;
	}

	@Override
	public String getFilename() {
		return null;
	}

	@Override
	public String getDescription() {
		return null;
	}

}
