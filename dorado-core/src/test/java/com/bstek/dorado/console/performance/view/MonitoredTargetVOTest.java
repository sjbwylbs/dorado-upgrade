package com.bstek.dorado.console.performance.view;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MonitoredTargetVOTest {

	private MonitoredTargetVO vo;

	@BeforeEach
	void setUp() {
		vo = new MonitoredTargetVO();
	}

	@Test
	void should_return_zero_for_all_numeric_fields_by_default() {
		assertThat(vo.getTime()).isEqualTo(0L);
		assertThat(vo.getSpendTime()).isEqualTo(0L);
		assertThat(vo.getFreeMemory()).isEqualTo(0L);
		assertThat(vo.getAvgTime()).isEqualTo(0.0);
		assertThat(vo.getCount()).isEqualTo(0L);
		assertThat(vo.getFrequency()).isEqualTo(0L);
		assertThat(vo.getMinTime()).isEqualTo(0L);
		assertThat(vo.getMaxTime()).isEqualTo(0L);
	}

	@Test
	void should_set_and_get_all_properties() {
		vo.setTime(1000L);
		vo.setSpendTime(500L);
		vo.setFreeMemory(2048L);
		vo.setAvgTime(250.5);
		vo.setCount(10L);
		vo.setFrequency(5L);
		vo.setMinTime(100L);
		vo.setMaxTime(900L);

		assertThat(vo.getTime()).isEqualTo(1000L);
		assertThat(vo.getSpendTime()).isEqualTo(500L);
		assertThat(vo.getFreeMemory()).isEqualTo(2048L);
		assertThat(vo.getAvgTime()).isEqualTo(250.5);
		assertThat(vo.getCount()).isEqualTo(10L);
		assertThat(vo.getFrequency()).isEqualTo(5L);
		assertThat(vo.getMinTime()).isEqualTo(100L);
		assertThat(vo.getMaxTime()).isEqualTo(900L);
	}

	@Test
	void should_inherit_monitoredTarget_properties() {
		vo.setId("target-1");
		vo.setName("test");
		vo.setStatus(true);
		assertThat(vo.getId()).isEqualTo("target-1");
		assertThat(vo.getName()).isEqualTo("test");
		assertThat(vo.getStatus()).isTrue();
	}
}
