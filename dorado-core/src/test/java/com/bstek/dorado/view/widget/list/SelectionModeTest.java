package com.bstek.dorado.view.widget.list;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SelectionModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(SelectionMode.values()).containsExactly(SelectionMode.none, SelectionMode.singleRow, SelectionMode.multiRows);
	}

	@Test
	void should_have_exactly_three_values() {
		assertThat(SelectionMode.values()).hasSize(3);
	}
}
