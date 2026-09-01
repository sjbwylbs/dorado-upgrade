package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class EscapeModeTest {

	@Test
	void should_have_three_constants_when_inspected() {
		assertThat(EscapeMode.values()).hasSize(3);
	}

	@Test
	void should_contain_YES_when_inspected() {
		assertThat(EscapeMode.valueOf("YES")).isEqualTo(EscapeMode.YES);
	}

	@Test
	void should_contain_NO_when_inspected() {
		assertThat(EscapeMode.valueOf("NO")).isEqualTo(EscapeMode.NO);
	}

	@Test
	void should_contain_AUTO_when_inspected() {
		assertThat(EscapeMode.valueOf("AUTO")).isEqualTo(EscapeMode.AUTO);
	}

	@Test
	void should_have_correct_ordinal_order() {
		assertThat(EscapeMode.YES.ordinal()).isEqualTo(0);
		assertThat(EscapeMode.NO.ordinal()).isEqualTo(1);
		assertThat(EscapeMode.AUTO.ordinal()).isEqualTo(2);
	}
}
