package com.bstek.dorado.view.widget.layout;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DockModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(DockMode.values()).containsExactly(
				DockMode.left, DockMode.top, DockMode.right, DockMode.bottom, DockMode.center);
	}

	@Test
	void should_have_exactly_five_values() {
		assertThat(DockMode.values()).hasSize(5);
	}
}
