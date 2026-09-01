package com.bstek.dorado.console.system.log.file;

import java.util.Collections;
import java.util.Hashtable;
import java.util.Map;

/**
 * 文件读取器管理
 *
 */
public class FileReaderManager {

	private Map<String, FileReader> readerMap = new Hashtable<>();

	public FileReader getReader(String key) {
		return readerMap.get(key);
	}

	public void registerReader(String key, FileReader fileReader) {
		readerMap.put(key, fileReader);
	}

	@SuppressWarnings("unchecked")
	public Map<String, FileReader> getReaders() {
		return Collections.unmodifiableMap(readerMap);
	}

}
