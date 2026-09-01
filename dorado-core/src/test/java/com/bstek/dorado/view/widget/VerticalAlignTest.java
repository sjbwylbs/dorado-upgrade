package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class VerticalAlignTest {

	@Test
	void should_have_three_values() {
		assertThat(VerticalAlign.values()).containsExactly(VerticalAlign.top, VerticalAlign.center, VerticalAlign.bottom);
	}

	@Test
	void should_parse_from_string() {
		assertThat(VerticalAlign.valueOf("top")).isEqualTo(VerticalAlign.top);
		assertThat(VerticalAlign.valueOf("center")).isEqualTo(VerticalAlign.center);
		assertThat(VerticalAlign.valueOf("bottom")).isEqualTo(VerticalAlign.bottom);
	}
}
