package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class TemplateFieldTest {

	private TemplateField field = new TemplateField();

	@Test
	void should_have_null_template_by_default() {
		assertThat(field.getTemplate()).isNull();
	}

	@Test
	void should_set_and_get_template() {
		field.setTemplate("<div>${name}</div>");
		assertThat(field.getTemplate()).isEqualTo("<div>${name}</div>");
	}
}
