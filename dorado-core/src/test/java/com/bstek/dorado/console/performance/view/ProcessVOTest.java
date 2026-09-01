package com.bstek.dorado.console.performance.view;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProcessVOTest {

	private ProcessVO vo;

	@BeforeEach
	void setUp() {
		vo = new ProcessVO();
	}

	@Test
	void should_return_false_for_status_by_default() {
		assertThat(vo.isStatus()).isFalse();
	}

	@Test
	void should_set_and_get_status() {
		vo.setStatus(true);
		assertThat(vo.isStatus()).isTrue();
	}

	@Test
	void should_inherit_process_properties() {
		vo.setName("process1");
		vo.setType("resolver");
		vo.setTime(1000L);
		vo.setSpendTime(500L);
		vo.setFreeMemory(1024L);

		assertThat(vo.getName()).isEqualTo("process1");
		assertThat(vo.getType()).isEqualTo("resolver");
		assertThat(vo.getTime()).isEqualTo(1000L);
		assertThat(vo.getSpendTime()).isEqualTo(500L);
		assertThat(vo.getFreeMemory()).isEqualTo(1024L);
	}
}
