package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FloatControlAlignTest {

	@Test
	void should_have_five_values() {
		assertThat(FloatControlAlign.values()).containsExactly(FloatControlAlign.left, FloatControlAlign.innerleft,
				FloatControlAlign.center, FloatControlAlign.innerright, FloatControlAlign.top);
	}

	@Test
	void should_parse_from_string() {
		assertThat(FloatControlAlign.valueOf("left")).isEqualTo(FloatControlAlign.left);
		assertThat(FloatControlAlign.valueOf("center")).isEqualTo(FloatControlAlign.center);
		assertThat(FloatControlAlign.valueOf("top")).isEqualTo(FloatControlAlign.top);
	}
}
