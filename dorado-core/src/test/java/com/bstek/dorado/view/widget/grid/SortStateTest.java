package com.bstek.dorado.view.widget.grid;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SortStateTest {

	@Test
	void should_contain_all_values() {
		assertThat(SortState.values()).containsExactly(SortState.none, SortState.asc, SortState.desc);
	}

	@Test
	void should_have_exactly_three_values() {
		assertThat(SortState.values()).hasSize(3);
	}

	@Test
	void should_resolve_by_name() {
		assertThat(SortState.valueOf("asc")).isEqualTo(SortState.asc);
		assertThat(SortState.valueOf("desc")).isEqualTo(SortState.desc);
	}
}
