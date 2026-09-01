package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class IconPositionTest {

	@Test
	void should_have_two_values() {
		assertThat(IconPosition.values()).containsExactly(IconPosition.left, IconPosition.top);
	}

	@Test
	void should_parse_from_string() {
		assertThat(IconPosition.valueOf("left")).isEqualTo(IconPosition.left);
		assertThat(IconPosition.valueOf("top")).isEqualTo(IconPosition.top);
	}
}
