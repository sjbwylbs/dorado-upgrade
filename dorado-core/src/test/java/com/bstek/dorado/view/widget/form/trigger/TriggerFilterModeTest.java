package com.bstek.dorado.view.widget.form.trigger;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class TriggerFilterModeTest {

	@Test
	void should_contain_clientSide_value() {
		assertThat(com.bstek.dorado.view.widget.form.trigger.FilterMode.valueOf("clientSide"))
				.isEqualTo(com.bstek.dorado.view.widget.form.trigger.FilterMode.clientSide);
	}

	@Test
	void should_contain_serverSide_value() {
		assertThat(com.bstek.dorado.view.widget.form.trigger.FilterMode.valueOf("serverSide"))
				.isEqualTo(com.bstek.dorado.view.widget.form.trigger.FilterMode.serverSide);
	}

	@Test
	void should_have_exactly_two_values() {
		assertThat(com.bstek.dorado.view.widget.form.trigger.FilterMode.values()).hasSize(2);
	}
}
