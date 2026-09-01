package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CheckBoxTest {

	private CheckBox checkBox;

	@BeforeEach
	void setUp() {
		checkBox = new CheckBox();
	}

	@Test
	void should_have_true_as_default_onValue() {
		assertThat(checkBox.getOnValue()).isEqualTo(true);
	}

	@Test
	void should_have_false_as_default_offValue() {
		assertThat(checkBox.getOffValue()).isEqualTo(false);
	}

	@Test
	void should_have_false_as_default_value() {
		assertThat(checkBox.getValue()).isEqualTo(false);
	}

	@Test
	void should_return_null_mixedValue_by_default() {
		assertThat(checkBox.getMixedValue()).isNull();
	}

	@Test
	void should_return_null_caption_by_default() {
		assertThat(checkBox.getCaption()).isNull();
	}

	@Test
	void should_return_false_for_triState_by_default() {
		assertThat(checkBox.isTriState()).isFalse();
	}

	@Test
	void should_set_and_get_onValue() {
		checkBox.setOnValue("yes");
		assertThat(checkBox.getOnValue()).isEqualTo("yes");
	}

	@Test
	void should_set_and_get_offValue() {
		checkBox.setOffValue("no");
		assertThat(checkBox.getOffValue()).isEqualTo("no");
	}

	@Test
	void should_set_and_get_mixedValue() {
		checkBox.setMixedValue("mixed");
		assertThat(checkBox.getMixedValue()).isEqualTo("mixed");
	}

	@Test
	void should_set_and_get_caption() {
		checkBox.setCaption("Accept terms");
		assertThat(checkBox.getCaption()).isEqualTo("Accept terms");
	}

	@Test
	void should_set_and_get_value() {
		checkBox.setValue(true);
		assertThat(checkBox.getValue()).isEqualTo(true);
	}

	@Test
	void should_set_and_get_triState() {
		checkBox.setTriState(true);
		assertThat(checkBox.isTriState()).isTrue();
	}
}
