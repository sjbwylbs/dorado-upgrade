package com.bstek.dorado.view.resolver;

import java.util.HashMap;
import java.util.Map;

public class ClientI18NFileRegistry {

	public static class FileInfo {

		private String path;

		private boolean replace;

		public FileInfo(String path, boolean replace) {
			this.path = path;
			this.replace = replace;
		}

		public String getPath() {
			return path;
		}

		public boolean isReplace() {
			return replace;
		}

	}

	private Map<String, FileInfo> fileMap;

	public synchronized void register(String packageName, String path, boolean replace) {
		if (fileMap == null) {
			fileMap = new HashMap<>();
		}
		fileMap.put(packageName, new FileInfo(path, replace));
	}

	public FileInfo getFileInfo(String packageName) {
		return (fileMap != null) ? fileMap.get(packageName) : null;
	}

}
