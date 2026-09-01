package com.bstek.dorado.core.io;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

/**
 * 抽象的资源描述对象的代理。
 *
 */
public abstract class AbstractResourceAdapter implements Resource {

	/**
	 * 被代理的资源描述对象。
	 */
	protected Resource adaptee;

	/**
	 * @param adaptee 被代理的资源描述对象。
	 */
	public AbstractResourceAdapter(Resource adaptee) {
		this.adaptee = adaptee;
	}

	@Override
	public Resource createRelative(String relativePath) throws IOException {
		return adaptee.createRelative(relativePath);
	}

	@Override
	public boolean exists() {
		return adaptee.exists();
	}

	@Override
	public String getDescription() {
		return adaptee.getDescription();
	}

	@Override
	public File getFile() throws IOException {
		return adaptee.getFile();
	}

	@Override
	public String getFilename() {
		return adaptee.getFilename();
	}

	@Override
	public InputStream getInputStream() throws IOException {
		return adaptee.getInputStream();
	}

	@Override
	public String getPath() {
		return adaptee.getPath();
	}

	@Override
	public long getTimestamp() throws IOException {
		return adaptee.getTimestamp();
	}

	@Override
	public URL getURL() throws IOException {
		return adaptee.getURL();
	}

}
