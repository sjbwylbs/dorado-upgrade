package com.bstek.dorado.view.widget.layout;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class AnchorModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(AnchorMode.values()).containsExactly(AnchorMode.auto, AnchorMode.none, AnchorMode.container, AnchorMode.previous);
	}

	@Test
	void should_have_exactly_four_values() {
		assertThat(AnchorMode.values()).hasSize(4);
	}
}
