package com.bstek.dorado.view;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ViewStateTest {

	@Test
	void should_contain_rendering_value() {
		assertThat(ViewState.valueOf("rendering")).isEqualTo(ViewState.rendering);
	}

	@Test
	void should_contain_servicing_value() {
		assertThat(ViewState.valueOf("servicing")).isEqualTo(ViewState.servicing);
	}

	@Test
	void should_contain_deprecated_servcing_value() {
		assertThat(ViewState.valueOf("servcing")).isEqualTo(ViewState.servcing);
	}

	@Test
	void should_have_exactly_three_values() {
		assertThat(ViewState.values()).hasSize(3);
	}

	@Test
	void should_have_servcing_as_deprecated() throws NoSuchFieldException {
		assertThat(ViewState.class.getField("servcing").isAnnotationPresent(Deprecated.class)).isTrue();
	}
}
