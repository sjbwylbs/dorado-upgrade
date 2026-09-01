package com.bstek.dorado.view.widget.base.tab;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class TabPlacementTest {

	@Test
	void should_contain_all_values() {
		assertThat(TabPlacement.values()).containsExactly(TabPlacement.top, TabPlacement.bottom);
	}

	@Test
	void should_have_exactly_two_values() {
		assertThat(TabPlacement.values()).hasSize(2);
	}
}
