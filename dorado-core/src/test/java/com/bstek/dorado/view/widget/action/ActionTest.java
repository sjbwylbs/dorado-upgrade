package com.bstek.dorado.view.widget.action;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ActionTest {

	private Action action = new Action();

	@Test
	void should_have_null_caption_by_default() {
		assertThat(action.getCaption()).isNull();
	}

	@Test
	void should_set_and_get_caption() {
		action.setCaption("Submit");
		assertThat(action.getCaption()).isEqualTo("Submit");
	}

	@Test
	void should_have_null_icon_by_default() {
		assertThat(action.getIcon()).isNull();
	}

	@Test
	void should_set_and_get_icon() {
		action.setIcon("/icons/ok.png");
		assertThat(action.getIcon()).isEqualTo("/icons/ok.png");
	}

	@Test
	void should_set_and_get_icon_class() {
		action.setIconClass("fa-check");
		assertThat(action.getIconClass()).isEqualTo("fa-check");
	}

	@Test
	void should_set_and_get_tip() {
		action.setTip("Click to submit");
		assertThat(action.getTip()).isEqualTo("Click to submit");
	}

	@Test
	void should_not_be_disabled_by_default() {
		assertThat(action.isDisabled()).isFalse();
	}

	@Test
	void should_set_and_get_disabled() {
		action.setDisabled(true);
		assertThat(action.isDisabled()).isTrue();
	}

	@Test
	void should_have_null_parameter_by_default() {
		assertThat(action.getParameter()).isNull();
	}

	@Test
	void should_set_and_get_parameter() {
		Object param = "testParam";
		action.setParameter(param);
		assertThat(action.getParameter()).isEqualTo(param);
	}

	@Test
	void should_set_and_get_hotkey() {
		action.setHotkey("ctrl+s");
		assertThat(action.getHotkey()).isEqualTo("ctrl+s");
	}

	@Test
	void should_set_and_get_confirm_message() {
		action.setConfirmMessage("Are you sure?");
		assertThat(action.getConfirmMessage()).isEqualTo("Are you sure?");
	}

	@Test
	void should_set_and_get_success_message() {
		action.setSuccessMessage("Done!");
		assertThat(action.getSuccessMessage()).isEqualTo("Done!");
	}
}
