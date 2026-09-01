package com.bstek.dorado.view.widget.blockview;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class BlockLayoutTest {

	@Test
	void should_have_two_values() {
		assertThat(BlockLayout.values()).containsExactly(BlockLayout.vertical, BlockLayout.horizontal);
	}

	@Test
	void should_parse_from_string() {
		assertThat(BlockLayout.valueOf("vertical")).isEqualTo(BlockLayout.vertical);
		assertThat(BlockLayout.valueOf("horizontal")).isEqualTo(BlockLayout.horizontal);
	}
}
