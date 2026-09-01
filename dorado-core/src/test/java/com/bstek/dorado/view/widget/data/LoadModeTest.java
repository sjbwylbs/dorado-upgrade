package com.bstek.dorado.view.widget.data;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LoadModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(LoadMode.values()).containsExactly(
				LoadMode.preload, LoadMode.onCreate, LoadMode.onReady, LoadMode.lazy, LoadMode.manual);
	}

	@Test
	void should_have_exactly_five_values() {
		assertThat(LoadMode.values()).hasSize(5);
	}

	@Test
	void should_resolve_by_name() {
		assertThat(LoadMode.valueOf("preload")).isEqualTo(LoadMode.preload);
		assertThat(LoadMode.valueOf("lazy")).isEqualTo(LoadMode.lazy);
	}
}
