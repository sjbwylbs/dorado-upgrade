package com.bstek.dorado.uploader.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SelectionModeTest {

	@Test
	void should_have_two_values() {
		assertThat(SelectionMode.values()).containsExactly(SelectionMode.singleFile, SelectionMode.multiFiles);
	}

	@Test
	void should_parse_from_string() {
		assertThat(SelectionMode.valueOf("singleFile")).isEqualTo(SelectionMode.singleFile);
		assertThat(SelectionMode.valueOf("multiFiles")).isEqualTo(SelectionMode.multiFiles);
	}
}
