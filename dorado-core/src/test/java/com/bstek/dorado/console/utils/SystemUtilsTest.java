package com.bstek.dorado.console.utils;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;

class SystemUtilsTest {

	@Test
	void should_return_non_empty_system_properties() {
		Map<String, Object> props = SystemUtils.getSystemProperties();
		assertThat(props).isNotEmpty();
	}

	@Test
	void should_contain_os_name() {
		Map<String, Object> props = SystemUtils.getSystemProperties();
		assertThat(props).containsKey("os_name");
		assertThat(props.get("os_name")).isNotNull();
	}

	@Test
	void should_contain_java_version() {
		Map<String, Object> props = SystemUtils.getSystemProperties();
		assertThat(props).containsKey("java_version");
		assertThat(props.get("java_version")).isNotNull();
	}

	@Test
	void should_contain_java_home() {
		Map<String, Object> props = SystemUtils.getSystemProperties();
		assertThat(props).containsKey("java_home");
		assertThat(props.get("java_home")).isNotNull();
	}

	@Test
	void should_return_non_empty_memory_info() {
		Map<String, Object> memInfo = SystemUtils.getMemoryInfo();
		assertThat(memInfo).isNotEmpty();
	}

	@Test
	void should_contain_free_memory() {
		Map<String, Object> memInfo = SystemUtils.getMemoryInfo();
		assertThat(memInfo).containsKey("freeMemory");
		assertThat((Long) memInfo.get("freeMemory")).isGreaterThan(0L);
	}

	@Test
	void should_contain_total_memory() {
		Map<String, Object> memInfo = SystemUtils.getMemoryInfo();
		assertThat(memInfo).containsKey("totalMemory");
		assertThat((Long) memInfo.get("totalMemory")).isGreaterThan(0L);
	}

	@Test
	void should_contain_cpu_count() {
		Map<String, Object> memInfo = SystemUtils.getMemoryInfo();
		assertThat(memInfo).containsKey("CPU");
		assertThat((Integer) memInfo.get("CPU")).isGreaterThan(0);
	}
}
