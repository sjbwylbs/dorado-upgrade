package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SubViewLoadModeTest {

	@Test
	void should_have_three_values() {
		assertThat(SubViewLoadMode.values()).containsExactly(SubViewLoadMode.preload, SubViewLoadMode.lazy,
				SubViewLoadMode.manual);
	}

	@Test
	void should_parse_from_string() {
		assertThat(SubViewLoadMode.valueOf("preload")).isEqualTo(SubViewLoadMode.preload);
		assertThat(SubViewLoadMode.valueOf("lazy")).isEqualTo(SubViewLoadMode.lazy);
		assertThat(SubViewLoadMode.valueOf("manual")).isEqualTo(SubViewLoadMode.manual);
	}
}
