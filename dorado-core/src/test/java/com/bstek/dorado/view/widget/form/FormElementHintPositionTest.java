package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FormElementHintPositionTest {

	@Test
	void should_contain_all_values() {
		assertThat(FormElementHintPosition.values()).containsExactly(FormElementHintPosition.right, FormElementHintPosition.bottom);
	}

	@Test
	void should_have_exactly_two_values() {
		assertThat(FormElementHintPosition.values()).hasSize(2);
	}
}
