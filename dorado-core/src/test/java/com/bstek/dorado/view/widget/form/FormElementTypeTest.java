package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FormElementTypeTest {

	@Test
	void should_have_five_values() {
		assertThat(FormElementType.values()).containsExactly(FormElementType.text, FormElementType.password,
				FormElementType.textArea, FormElementType.checkBox, FormElementType.radioGroup);
	}

	@Test
	void should_parse_from_string() {
		assertThat(FormElementType.valueOf("text")).isEqualTo(FormElementType.text);
		assertThat(FormElementType.valueOf("password")).isEqualTo(FormElementType.password);
		assertThat(FormElementType.valueOf("textArea")).isEqualTo(FormElementType.textArea);
	}
}
