package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class RadioGroupLayoutTest {

	@Test
	void should_contain_all_values() {
		assertThat(RadioGroupLayout.values()).containsExactly(
				RadioGroupLayout.vertical, RadioGroupLayout.flow, RadioGroupLayout.grid);
	}

	@Test
	void should_have_exactly_three_values() {
		assertThat(RadioGroupLayout.values()).hasSize(3);
	}
}
