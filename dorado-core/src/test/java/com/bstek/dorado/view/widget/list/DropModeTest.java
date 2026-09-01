package com.bstek.dorado.view.widget.list;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DropModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(DropMode.values()).containsExactly(
				DropMode.onControl, DropMode.onItem, DropMode.insertItems,
				DropMode.onOrInsertItems, DropMode.onAnyWhere);
	}

	@Test
	void should_have_exactly_five_values() {
		assertThat(DropMode.values()).hasSize(5);
	}
}
