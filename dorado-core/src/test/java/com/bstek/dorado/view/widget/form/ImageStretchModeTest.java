package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ImageStretchModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(ImageStretchMode.values()).containsExactly(
				ImageStretchMode.fitWidth, ImageStretchMode.fitHeight, ImageStretchMode.keepRatio,
				ImageStretchMode.fill, ImageStretchMode.stretch, ImageStretchMode.none);
	}

	@Test
	void should_have_exactly_six_values() {
		assertThat(ImageStretchMode.values()).hasSize(6);
	}
}
