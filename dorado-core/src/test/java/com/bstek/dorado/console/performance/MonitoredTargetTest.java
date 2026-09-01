package com.bstek.dorado.console.performance;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MonitoredTargetTest {

	private MonitoredTarget target;

	@BeforeEach
	void setUp() {
		target = new MonitoredTarget();
	}

	@Test
	void should_return_null_id_by_default() {
		assertThat(target.getId()).isNull();
	}

	@Test
	void should_set_and_get_all_properties() {
		target.setId("target-1");
		target.setName("DataProvider");
		target.setMonitoringTime(60000L);
		target.setCancelTime(120000L);
		target.setStatus(true);
		target.setDescription("Test target");
		target.setType("dataProvider");

		assertThat(target.getId()).isEqualTo("target-1");
		assertThat(target.getName()).isEqualTo("DataProvider");
		assertThat(target.getMonitoringTime()).isEqualTo(60000L);
		assertThat(target.getCancelTime()).isEqualTo(120000L);
		assertThat(target.getStatus()).isTrue();
		assertThat(target.getDescription()).isEqualTo("Test target");
		assertThat(target.getType()).isEqualTo("dataProvider");
	}

	@Test
	void should_create_with_all_args_constructor() {
		MonitoredTarget full = new MonitoredTarget("id-1", "name", 100L, 200L, true, "desc", "type");
		assertThat(full.getId()).isEqualTo("id-1");
		assertThat(full.getName()).isEqualTo("name");
		assertThat(full.getMonitoringTime()).isEqualTo(100L);
		assertThat(full.getCancelTime()).isEqualTo(200L);
		assertThat(full.getStatus()).isTrue();
		assertThat(full.getDescription()).isEqualTo("desc");
		assertThat(full.getType()).isEqualTo("type");
	}

	@Test
	void should_contain_all_fields_in_toString() {
		target.setId("id-1");
		target.setName("TestTarget");
		target.setMonitoringTime(100L);
		target.setCancelTime(200L);
		target.setStatus(true);
		target.setDescription("desc");
		target.setType("type");
		String str = target.toString();
		assertThat(str).contains("id-1", "TestTarget", "100", "200", "true", "desc", "type");
	}
}
