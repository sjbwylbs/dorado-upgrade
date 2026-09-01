package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class OverflowTest {

	@Test
	void should_have_four_values() {
		assertThat(Overflow.values()).containsExactly(Overflow.visible, Overflow.hidden, Overflow.scroll, Overflow.auto);
	}

	@Test
	void should_parse_from_string() {
		assertThat(Overflow.valueOf("visible")).isEqualTo(Overflow.visible);
		assertThat(Overflow.valueOf("hidden")).isEqualTo(Overflow.hidden);
		assertThat(Overflow.valueOf("scroll")).isEqualTo(Overflow.scroll);
		assertThat(Overflow.valueOf("auto")).isEqualTo(Overflow.auto);
	}
}
