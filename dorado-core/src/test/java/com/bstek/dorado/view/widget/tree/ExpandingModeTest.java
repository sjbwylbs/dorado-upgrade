package com.bstek.dorado.view.widget.tree;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ExpandingModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(ExpandingMode.values()).containsExactly(ExpandingMode.async, ExpandingMode.sync);
	}

	@Test
	void should_have_exactly_two_values() {
		assertThat(ExpandingMode.values()).hasSize(2);
	}
}
