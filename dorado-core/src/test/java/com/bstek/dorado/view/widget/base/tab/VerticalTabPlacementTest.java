package com.bstek.dorado.view.widget.base.tab;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class VerticalTabPlacementTest {

	@Test
	void should_contain_all_values() {
		assertThat(VerticalTabPlacement.values()).containsExactly(VerticalTabPlacement.left, VerticalTabPlacement.right);
	}

	@Test
	void should_have_exactly_two_values() {
		assertThat(VerticalTabPlacement.values()).hasSize(2);
	}
}
