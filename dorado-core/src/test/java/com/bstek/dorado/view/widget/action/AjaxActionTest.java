package com.bstek.dorado.view.widget.action;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class AjaxActionTest {

	private AjaxAction action = new AjaxAction();

	@Test
	void should_have_zero_timeout_by_default() {
		assertThat(action.getTimeout()).isZero();
	}

	@Test
	void should_set_and_get_timeout() {
		action.setTimeout(5000L);
		assertThat(action.getTimeout()).isEqualTo(5000L);
	}

	@Test
	void should_be_batchable_by_default() {
		assertThat(action.isBatchable()).isTrue();
	}

	@Test
	void should_set_and_get_batchable() {
		action.setBatchable(false);
		assertThat(action.isBatchable()).isFalse();
	}

	@Test
	void should_have_null_service_by_default() {
		assertThat(action.getService()).isNull();
	}

	@Test
	void should_set_and_get_service() {
		action.setService("userService.save");
		assertThat(action.getService()).isEqualTo("userService.save");
	}

	@Test
	void should_support_entity_by_default() {
		assertThat(action.isSupportsEntity()).isTrue();
	}

	@Test
	void should_set_and_get_supports_entity() {
		action.setSupportsEntity(false);
		assertThat(action.isSupportsEntity()).isFalse();
	}
}
