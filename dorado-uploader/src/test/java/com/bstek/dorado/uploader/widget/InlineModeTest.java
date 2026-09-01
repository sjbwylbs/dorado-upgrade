package com.bstek.dorado.uploader.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class InlineModeTest {

	@Test
	void should_have_three_values() {
		assertThat(InlineMode.values()).containsExactly(InlineMode.none, InlineMode.off, InlineMode.browser);
	}

	@Test
	void should_parse_from_string() {
		assertThat(InlineMode.valueOf("none")).isEqualTo(InlineMode.none);
		assertThat(InlineMode.valueOf("off")).isEqualTo(InlineMode.off);
		assertThat(InlineMode.valueOf("browser")).isEqualTo(InlineMode.browser);
	}
}
