package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HideModeTest {

	@Test
	void should_have_two_values() {
		assertThat(HideMode.values()).containsExactly(HideMode.visibility, HideMode.display);
	}

	@Test
	void should_parse_from_string() {
		assertThat(HideMode.valueOf("visibility")).isEqualTo(HideMode.visibility);
		assertThat(HideMode.valueOf("display")).isEqualTo(HideMode.display);
	}
}
