package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ImagePackModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(ImagePackMode.values()).containsExactly(ImagePackMode.start, ImagePackMode.center, ImagePackMode.end);
	}

	@Test
	void should_have_exactly_three_values() {
		assertThat(ImagePackMode.values()).hasSize(3);
	}
}
