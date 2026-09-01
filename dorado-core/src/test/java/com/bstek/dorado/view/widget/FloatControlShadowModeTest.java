package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FloatControlShadowModeTest {

	@Test
	void should_have_four_values() {
		assertThat(FloatControlShadowMode.values()).containsExactly(FloatControlShadowMode.drop,
				FloatControlShadowMode.sides, FloatControlShadowMode.frame, FloatControlShadowMode.none);
	}

	@Test
	void should_parse_from_string() {
		assertThat(FloatControlShadowMode.valueOf("drop")).isEqualTo(FloatControlShadowMode.drop);
		assertThat(FloatControlShadowMode.valueOf("none")).isEqualTo(FloatControlShadowMode.none);
	}
}
