package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FloatControlAnimateTypeTest {

	@Test
	void should_have_eight_values() {
		assertThat(FloatControlAnimateType.values()).containsExactly(FloatControlAnimateType.zoom,
				FloatControlAnimateType.modernZoom, FloatControlAnimateType.flip, FloatControlAnimateType.slide,
				FloatControlAnimateType.safeSlide, FloatControlAnimateType.modernSlide, FloatControlAnimateType.fade,
				FloatControlAnimateType.none);
	}

	@Test
	void should_parse_from_string() {
		assertThat(FloatControlAnimateType.valueOf("zoom")).isEqualTo(FloatControlAnimateType.zoom);
		assertThat(FloatControlAnimateType.valueOf("fade")).isEqualTo(FloatControlAnimateType.fade);
		assertThat(FloatControlAnimateType.valueOf("none")).isEqualTo(FloatControlAnimateType.none);
	}
}
