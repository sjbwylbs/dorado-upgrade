package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DataMessageTest {

	private DataMessage message = new DataMessage();

	@Test
	void should_not_show_icon_only_by_default() {
		assertThat(message.isShowIconOnly()).isFalse();
	}

	@Test
	void should_set_and_get_show_icon_only() {
		message.setShowIconOnly(true);
		assertThat(message.isShowIconOnly()).isTrue();
	}

	@Test
	void should_not_show_multi_message_by_default() {
		assertThat(message.isShowMultiMessage()).isFalse();
	}

	@Test
	void should_set_and_get_show_multi_message() {
		message.setShowMultiMessage(true);
		assertThat(message.isShowMultiMessage()).isTrue();
	}
}
