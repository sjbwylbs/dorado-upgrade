package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class AlignTest {

	@Test
	void should_contain_left_value() {
		assertThat(Align.valueOf("left")).isEqualTo(Align.left);
	}

	@Test
	void should_contain_center_value() {
		assertThat(Align.valueOf("center")).isEqualTo(Align.center);
	}

	@Test
	void should_contain_right_value() {
		assertThat(Align.valueOf("right")).isEqualTo(Align.right);
	}

	@Test
	void should_have_exactly_three_values() {
		assertThat(Align.values()).hasSize(3);
	}
}
