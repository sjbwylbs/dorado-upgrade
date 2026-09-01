package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RadioButtonTest {

	private RadioButton radioButton;

	@BeforeEach
	void setUp() {
		radioButton = new RadioButton();
	}

	@Test
	void should_return_null_text_by_default() {
		assertThat(radioButton.getText()).isNull();
	}

	@Test
	void should_return_null_value_by_default() {
		assertThat(radioButton.getValue()).isNull();
	}

	@Test
	void should_return_false_for_readOnly_by_default() {
		assertThat(radioButton.isReadOnly()).isFalse();
	}

	@Test
	void should_set_and_get_text() {
		radioButton.setText("Option A");
		assertThat(radioButton.getText()).isEqualTo("Option A");
	}

	@Test
	void should_set_and_get_value() {
		radioButton.setValue("A");
		assertThat(radioButton.getValue()).isEqualTo("A");
	}

	@Test
	void should_set_and_get_readOnly() {
		radioButton.setReadOnly(true);
		assertThat(radioButton.isReadOnly()).isTrue();
	}
}
