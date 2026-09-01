package com.bstek.dorado.view.widget.grid;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FilterModeTest {

	@Test
	void should_have_two_values() {
		assertThat(FilterMode.values()).containsExactly(FilterMode.clientSide, FilterMode.serverSide);
	}

	@Test
	void should_parse_from_string() {
		assertThat(FilterMode.valueOf("clientSide")).isEqualTo(FilterMode.clientSide);
		assertThat(FilterMode.valueOf("serverSide")).isEqualTo(FilterMode.serverSide);
	}
}
