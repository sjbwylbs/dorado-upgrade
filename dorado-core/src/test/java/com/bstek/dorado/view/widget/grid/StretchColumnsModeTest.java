package com.bstek.dorado.view.widget.grid;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class StretchColumnsModeTest {

	@Test
	void should_contain_all_values() {
		assertThat(StretchColumnsMode.values()).containsExactly(
				StretchColumnsMode.auto, StretchColumnsMode.off, StretchColumnsMode.stretchableColumns,
				StretchColumnsMode.lastColumn, StretchColumnsMode.allColumns, StretchColumnsMode.allResizeableColumns);
	}

	@Test
	void should_have_exactly_six_values() {
		assertThat(StretchColumnsMode.values()).hasSize(6);
	}
}
