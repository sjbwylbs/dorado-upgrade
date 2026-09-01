package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ModalTypeTest {

	@Test
	void should_have_two_values() {
		assertThat(ModalType.values()).containsExactly(ModalType.dark, ModalType.transparent);
	}

	@Test
	void should_parse_from_string() {
		assertThat(ModalType.valueOf("dark")).isEqualTo(ModalType.dark);
		assertThat(ModalType.valueOf("transparent")).isEqualTo(ModalType.transparent);
	}
}
