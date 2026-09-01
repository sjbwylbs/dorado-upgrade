package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ExpressionModeTest {

	@Test
	void should_have_two_constants_when_inspected() {
		assertThat(ExpressionMode.values()).hasSize(2);
	}

	@Test
	void should_contain_DYNA_when_inspected() {
		assertThat(ExpressionMode.valueOf("DYNA")).isEqualTo(ExpressionMode.DYNA);
	}

	@Test
	void should_contain_NORMAL_when_inspected() {
		assertThat(ExpressionMode.valueOf("NORMAL")).isEqualTo(ExpressionMode.NORMAL);
	}

	@Test
	void should_have_correct_ordinal_order() {
		assertThat(ExpressionMode.DYNA.ordinal()).isEqualTo(0);
		assertThat(ExpressionMode.NORMAL.ordinal()).isEqualTo(1);
	}
}
