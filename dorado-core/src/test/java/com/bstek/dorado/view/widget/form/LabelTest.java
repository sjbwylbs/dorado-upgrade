package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LabelTest {

	private Label label;

	@BeforeEach
	void setUp() {
		label = new Label();
	}

	@Test
	void should_return_null_text_by_default() {
		assertThat(label.getText()).isNull();
	}

	@Test
	void should_set_and_get_text() {
		label.setText("Hello World");
		assertThat(label.getText()).isEqualTo("Hello World");
	}

	@Test
	void should_set_text_to_null() {
		label.setText("Hello");
		label.setText(null);
		assertThat(label.getText()).isNull();
	}
}
