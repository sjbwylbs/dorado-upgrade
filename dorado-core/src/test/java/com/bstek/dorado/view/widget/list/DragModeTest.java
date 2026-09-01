package com.bstek.dorado.view.widget.list;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DragModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(DragMode.values()).containsExactly(DragMode.item, DragMode.control, DragMode.itemOrControl);
	}

	@Test
	void should_have_exactly_three_values() {
		assertThat(DragMode.values()).hasSize(3);
	}
}
