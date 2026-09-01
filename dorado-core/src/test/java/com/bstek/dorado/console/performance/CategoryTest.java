package com.bstek.dorado.console.performance;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CategoryTest {

	private Category category;

	@BeforeEach
	void setUp() {
		category = new Category("testCategory");
	}

	@Test
	void should_set_name_via_constructor() {
		assertThat(category.getName()).isEqualTo("testCategory");
	}

	@Test
	void should_return_zero_count_initially() {
		assertThat(category.getCount()).isEqualTo(0);
	}

	@Test
	void should_return_zero_avgTime_initially() {
		assertThat(category.getAvgTime()).isEqualTo(0.0);
	}

	@Test
	void should_return_null_firstProcess_initially() {
		assertThat(category.getFirstProcess()).isNull();
	}

	@Test
	void should_return_null_maxTimeProcess_initially() {
		assertThat(category.getMaxTimeProcess()).isNull();
	}

	@Test
	void should_return_null_minTimeProcess_initially() {
		assertThat(category.getMinTimeProcess()).isNull();
	}

	@Test
	void should_register_first_process() {
		Process p = createProcess(100L);
		category.registerProcess(p);

		assertThat(category.getCount()).isEqualTo(1);
		assertThat(category.getFirstProcess()).isEqualTo(p);
		assertThat(category.getMaxTimeProcess()).isEqualTo(p);
		assertThat(category.getMinTimeProcess()).isEqualTo(p);
		assertThat(category.getAvgTime()).isEqualTo(100.0);
	}

	@Test
	void should_update_avgTime_on_second_process() {
		Process p1 = createProcess(100L);
		Process p2 = createProcess(200L);
		category.registerProcess(p1);
		category.registerProcess(p2);

		assertThat(category.getCount()).isEqualTo(2);
		assertThat(category.getAvgTime()).isEqualTo(150.0); // (100+200)/2
	}

	@Test
	void should_track_maxTimeProcess() {
		Process p1 = createProcess(100L);
		Process p2 = createProcess(300L);
		Process p3 = createProcess(200L);
		category.registerProcess(p1);
		category.registerProcess(p2);
		category.registerProcess(p3);

		assertThat(category.getMaxTimeProcess()).isEqualTo(p2);
	}

	@Test
	void should_track_minTimeProcess() {
		Process p1 = createProcess(300L);
		Process p2 = createProcess(100L);
		Process p3 = createProcess(200L);
		category.registerProcess(p1);
		category.registerProcess(p2);
		category.registerProcess(p3);

		assertThat(category.getMinTimeProcess()).isEqualTo(p2);
	}

	@Test
	void should_track_excludeFirstMaxProcess() {
		Process p1 = createProcess(500L); // first - excluded
		Process p2 = createProcess(100L);
		Process p3 = createProcess(300L);
		category.registerProcess(p1);
		category.registerProcess(p2);
		category.registerProcess(p3);

		assertThat(category.getExcludeFirstMaxProcess()).isEqualTo(p3);
	}

	@Test
	void should_calculate_excludeFirstAvgTime() {
		Process p1 = createProcess(100L); // first - excluded
		Process p2 = createProcess(200L);
		Process p3 = createProcess(300L);
		category.registerProcess(p1);
		category.registerProcess(p2);
		category.registerProcess(p3);

		// excludeFirstAvgTime = (0 * 0 + 200) / 1 = 200 for second, then (200 * 1 + 300) / 2 = 250
		assertThat(category.getExcludeFirstAvgTime()).isEqualTo(250.0);
	}

	@Test
	void should_set_and_get_excludeFirstMaxProcess() {
		Process p = createProcess(100L);
		category.setExcludeFirstMaxProcess(p);
		assertThat(category.getExcludeFirstMaxProcess()).isEqualTo(p);
	}

	private Process createProcess(long spendTime) {
		Process p = new Process();
		p.setSpendTime(spendTime);
		return p;
	}
}
