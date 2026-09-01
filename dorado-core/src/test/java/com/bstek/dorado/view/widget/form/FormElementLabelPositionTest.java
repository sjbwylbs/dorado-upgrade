package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FormElementLabelPositionTest {

	@Test
	void should_contain_all_values() {
		assertThat(FormElementLabelPosition.values()).containsExactly(FormElementLabelPosition.left, FormElementLabelPosition.top);
	}

	@Test
	void should_have_exactly_two_values() {
		assertThat(FormElementLabelPosition.values()).hasSize(2);
	}
}
