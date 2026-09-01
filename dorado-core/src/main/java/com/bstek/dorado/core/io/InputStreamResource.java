package com.bstek.dorado.core.io;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import org.apache.commons.lang3.StringUtils;

/**
 * 用于将InputStream包装成资源描述对象的包装器。
 *
 */
public class InputStreamResource implements Resource {

	private InputStream in;

	private String description;

	/**
	 * 构造器。
	 * @param in 将被包装的InputStream。
	 */
	public InputStreamResource(InputStream in) {
		this.in = in;
	}

	/**
	 * 构造器。
	 * @param in 将被包装的InputStream。
	 * @param description 资源描述。
	 */
	public InputStreamResource(InputStream in, String description) {
		this(in);
		this.description = description;
	}

	@Override
	public Resource createRelative(String relativePath) throws IOException {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean exists() {
		return in != null;
	}

	@Override
	public String getDescription() {
		return description;
	}

	@Override
	public File getFile() throws IOException {
		return null;
	}

	@Override
	public String getFilename() {
		return null;
	}

	@Override
	public InputStream getInputStream() throws IOException {
		return in;
	}

	@Override
	public String getPath() {
		return null;
	}

	@Override
	public long getTimestamp() throws IOException {
		return 0;
	}

	@Override
	public URL getURL() throws IOException {
		return null;
	}

	@Override
	public String toString() {
		return (StringUtils.isNotEmpty(description)) ? description : ("[" + this.getClass() + "]");
	}

}
