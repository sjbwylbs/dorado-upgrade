package com.bstek.dorado.view.widget.grid;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SortModeTest {

	@Test
	void should_contain_clientSide_value() {
		assertThat(SortMode.valueOf("clientSide")).isEqualTo(SortMode.clientSide);
	}

	@Test
	void should_contain_serverSide_value() {
		assertThat(SortMode.valueOf("serverSide")).isEqualTo(SortMode.serverSide);
	}

	@Test
	void should_have_exactly_two_values() {
		assertThat(SortMode.values()).hasSize(2);
	}
}
