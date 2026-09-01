package com.bstek.dorado.console.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * System 辅助类
 *
 */
public class SystemUtils {

	/**
	 * 获取系统参数
	 * @return
	 */
	public static Map<String, Object> getSystemProperties() {
		Map<String, Object> map = new HashMap<>();

		map.put("os_name", System.getProperty("os.name"));
		map.put("os_arch", System.getProperty("os.arch"));
		map.put("os_version", System.getProperty("os.version"));
		map.put("user_name", System.getProperty("user.name"));
		map.put("class_path", System.getProperty("java.class.path"));
		map.put("file_encoding", System.getProperty("file.encoding"));
		map.put("library_path", System.getProperty("java.library.path").replace(";", "<br>"));
		map.put("java_version", System.getProperty("java.version"));
		map.put("java_vendor", System.getProperty("java.vendor"));
		map.put("java_vm_specification_version", System.getProperty("java.vm.specification.version"));
		map.put("java_vm_specification_vendor", System.getProperty("java.vm.specification.vendor"));
		map.put("java_vm_specification_name	", System.getProperty("java.vm.specification.name"));
		map.put("java_vm_version", System.getProperty("java.vm.version"));
		map.put("java_vm_vendor", System.getProperty("java.vm.vendor"));
		map.put("java_vm_name", System.getProperty("java.vm.name"));
		map.put("java_home", System.getProperty("java.home"));

		return map;
	}

	/**
	 * 获得当前运行环境内存状况
	 * @return
	 */
	public static Map<String, Object> getMemoryInfo() {
		Map<String, Object> map = new HashMap<>();
		Runtime runtime = Runtime.getRuntime();
		map.put("runtime", runtime);

		map.put("freeMemory", runtime.freeMemory());
		map.put("totalMemory", runtime.totalMemory());
		if (System.getProperty("java.version").compareTo("1.4") >= 0) {
			map.put("maxMemory", runtime.maxMemory());
		} else {
			map.put("maxMemory", "N/A");
		}

		map.put("CPU", runtime.availableProcessors());
		return map;
	}

}
