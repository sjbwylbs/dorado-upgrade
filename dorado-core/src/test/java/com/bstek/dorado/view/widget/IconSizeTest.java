package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class IconSizeTest {

	@Test
	void should_have_two_values() {
		assertThat(IconSize.values()).containsExactly(IconSize.normal, IconSize.big);
	}

	@Test
	void should_parse_from_string() {
		assertThat(IconSize.valueOf("normal")).isEqualTo(IconSize.normal);
		assertThat(IconSize.valueOf("big")).isEqualTo(IconSize.big);
	}
}
