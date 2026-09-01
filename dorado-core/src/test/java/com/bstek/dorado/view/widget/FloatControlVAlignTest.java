package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FloatControlVAlignTest {

	@Test
	void should_have_five_values() {
		assertThat(FloatControlVAlign.values()).containsExactly(FloatControlVAlign.top, FloatControlVAlign.innertop,
				FloatControlVAlign.center, FloatControlVAlign.innerbottom, FloatControlVAlign.bottom);
	}

	@Test
	void should_parse_from_string() {
		assertThat(FloatControlVAlign.valueOf("top")).isEqualTo(FloatControlVAlign.top);
		assertThat(FloatControlVAlign.valueOf("center")).isEqualTo(FloatControlVAlign.center);
		assertThat(FloatControlVAlign.valueOf("bottom")).isEqualTo(FloatControlVAlign.bottom);
	}
}
