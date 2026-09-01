package com.bstek.dorado.view;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ViewRenderModeTest {

	@Test
	void should_contain_onCreate_value() {
		assertThat(ViewRenderMode.valueOf("onCreate")).isEqualTo(ViewRenderMode.onCreate);
	}

	@Test
	void should_contain_onDataLoaded_value() {
		assertThat(ViewRenderMode.valueOf("onDataLoaded")).isEqualTo(ViewRenderMode.onDataLoaded);
	}

	@Test
	void should_contain_manual_value() {
		assertThat(ViewRenderMode.valueOf("manual")).isEqualTo(ViewRenderMode.manual);
	}

	@Test
	void should_have_exactly_three_values() {
		assertThat(ViewRenderMode.values()).hasSize(3);
	}

	@Test
	void should_return_correct_name() {
		assertThat(ViewRenderMode.onCreate.name()).isEqualTo("onCreate");
		assertThat(ViewRenderMode.onDataLoaded.name()).isEqualTo("onDataLoaded");
		assertThat(ViewRenderMode.manual.name()).isEqualTo("manual");
	}
}
