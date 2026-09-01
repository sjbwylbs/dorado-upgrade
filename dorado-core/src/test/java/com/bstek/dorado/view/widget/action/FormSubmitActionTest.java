package com.bstek.dorado.view.widget.action;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FormSubmitActionTest {

	private FormSubmitAction action = new FormSubmitAction();

	@Test
	void should_have_null_action_by_default() {
		assertThat(action.getAction()).isNull();
	}

	@Test
	void should_set_and_get_action() {
		action.setAction("/api/submit");
		assertThat(action.getAction()).isEqualTo("/api/submit");
	}

	@Test
	void should_have_null_target_by_default() {
		assertThat(action.getTarget()).isNull();
	}

	@Test
	void should_set_and_get_target() {
		action.setTarget("_blank");
		assertThat(action.getTarget()).isEqualTo("_blank");
	}

	@Test
	void should_have_post_method_by_default() {
		assertThat(action.getMethod()).isEqualTo(SubmitMethod.post);
	}

	@Test
	void should_set_and_get_method() {
		action.setMethod(SubmitMethod.get);
		assertThat(action.getMethod()).isEqualTo(SubmitMethod.get);
	}
}
