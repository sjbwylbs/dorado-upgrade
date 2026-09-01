package com.bstek.dorado.core.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import com.bstek.dorado.util.PathUtils;

public class FileResource implements Resource {

	private File file;

	public FileResource(File file) {
		this.file = file;
	}

	@Override
	public String getPath() {
		return file.getAbsolutePath();
	}

	@Override
	public boolean exists() {
		return file.exists();
	}

	@Override
	public long getTimestamp() throws IOException {
		return file.lastModified();
	}

	@Override
	public InputStream getInputStream() throws IOException {
		return new FileInputStream(file);
	}

	@Override
	public URL getURL() throws IOException {
		return null;
	}

	@Override
	public File getFile() throws IOException {
		return file;
	}

	@Override
	public Resource createRelative(String relativePath) throws IOException {
		String path = PathUtils.concatPath(file.getParent(), relativePath);
		File newFile = new File(path);
		return new FileResource(newFile);
	}

	@Override
	public String getFilename() {
		return file.getName();
	}

	@Override
	public String getDescription() {
		return getPath();
	}

}
