package com.bstek.dorado.console.performance;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProcessTest {

	private Process process;

	@BeforeEach
	void setUp() {
		process = new Process();
	}

	@Test
	void should_return_null_name_by_default() {
		assertThat(process.getName()).isNull();
	}

	@Test
	void should_return_null_type_by_default() {
		assertThat(process.getType()).isNull();
	}

	@Test
	void should_return_zero_time_by_default() {
		assertThat(process.getTime()).isEqualTo(0L);
	}

	@Test
	void should_return_zero_spendTime_by_default() {
		assertThat(process.getSpendTime()).isEqualTo(0L);
	}

	@Test
	void should_return_zero_freeMemory_by_default() {
		assertThat(process.getFreeMemory()).isEqualTo(0L);
	}

	@Test
	void should_set_and_get_name() {
		process.setName("testProcess");
		assertThat(process.getName()).isEqualTo("testProcess");
	}

	@Test
	void should_set_and_get_type() {
		process.setType("dataProvider");
		assertThat(process.getType()).isEqualTo("dataProvider");
	}

	@Test
	void should_set_and_get_time() {
		process.setTime(1000L);
		assertThat(process.getTime()).isEqualTo(1000L);
	}

	@Test
	void should_set_and_get_spendTime() {
		process.setSpendTime(500L);
		assertThat(process.getSpendTime()).isEqualTo(500L);
	}

	@Test
	void should_set_and_get_freeMemory() {
		process.setFreeMemory(1024L);
		assertThat(process.getFreeMemory()).isEqualTo(1024L);
	}

	@Test
	void should_compare_by_spendTime() {
		Process p1 = new Process();
		p1.setSpendTime(100L);
		Process p2 = new Process();
		p2.setSpendTime(200L);
		assertThat(process.compare(p1, p2)).isNegative();
		assertThat(process.compare(p2, p1)).isPositive();
		assertThat(process.compare(p1, p1)).isZero();
	}

	@Test
	void should_contain_all_fields_in_toString() {
		process.setName("myProcess");
		process.setType("resolver");
		process.setTime(1000L);
		process.setSpendTime(500L);
		process.setFreeMemory(1024L);
		String str = process.toString();
		assertThat(str).contains("myProcess", "resolver", "1000", "500", "1024");
	}
}
