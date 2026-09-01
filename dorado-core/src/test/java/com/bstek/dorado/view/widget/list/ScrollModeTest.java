package com.bstek.dorado.view.widget.list;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ScrollModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(ScrollMode.values()).containsExactly(ScrollMode.simple, ScrollMode.lazyRender, ScrollMode.viewport);
	}

	@Test
	void should_have_exactly_three_values() {
		assertThat(ScrollMode.values()).hasSize(3);
	}
}
