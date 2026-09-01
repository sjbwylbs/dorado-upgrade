package com.bstek.dorado.view.widget.grid;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class GridFilterModeTest {

	@Test
	void should_contain_clientSide_value() {
		assertThat(com.bstek.dorado.view.widget.grid.FilterMode.valueOf("clientSide"))
				.isEqualTo(com.bstek.dorado.view.widget.grid.FilterMode.clientSide);
	}

	@Test
	void should_contain_serverSide_value() {
		assertThat(com.bstek.dorado.view.widget.grid.FilterMode.valueOf("serverSide"))
				.isEqualTo(com.bstek.dorado.view.widget.grid.FilterMode.serverSide);
	}

	@Test
	void should_have_exactly_two_values() {
		assertThat(com.bstek.dorado.view.widget.grid.FilterMode.values()).hasSize(2);
	}
}
