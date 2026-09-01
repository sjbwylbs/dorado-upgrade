package com.bstek.dorado.view.widget.base.tab;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class TabTest {

	private Tab tab = new Tab();

	@Test
	void should_have_null_name_by_default() {
		assertThat(tab.getName()).isNull();
	}

	@Test
	void should_set_and_get_name() {
		tab.setName("tab1");
		assertThat(tab.getName()).isEqualTo("tab1");
	}

	@Test
	void should_set_and_get_caption() {
		tab.setCaption("My Tab");
		assertThat(tab.getCaption()).isEqualTo("My Tab");
	}

	@Test
	void should_not_be_closeable_by_default() {
		assertThat(tab.isCloseable()).isFalse();
	}

	@Test
	void should_set_and_get_closeable() {
		tab.setCloseable(true);
		assertThat(tab.isCloseable()).isTrue();
	}

	@Test
	void should_set_and_get_icon() {
		tab.setIcon("/icons/tab.png");
		assertThat(tab.getIcon()).isEqualTo("/icons/tab.png");
	}

	@Test
	void should_set_and_get_icon_class() {
		tab.setIconClass("fa-home");
		assertThat(tab.getIconClass()).isEqualTo("fa-home");
	}

	@Test
	void should_not_be_disabled_by_default() {
		assertThat(tab.isDisabled()).isFalse();
	}

	@Test
	void should_set_and_get_disabled() {
		tab.setDisabled(true);
		assertThat(tab.isDisabled()).isTrue();
	}

	@Test
	void should_be_visible_by_default() {
		assertThat(tab.isVisible()).isTrue();
	}

	@Test
	void should_set_and_get_visible() {
		tab.setVisible(false);
		assertThat(tab.isVisible()).isFalse();
	}

	@Test
	void should_set_and_get_tip() {
		tab.setTip("Hover text");
		assertThat(tab.getTip()).isEqualTo("Hover text");
	}

	@Test
	void should_set_and_get_width() {
		tab.setWidth("200px");
		assertThat(tab.getWidth()).isEqualTo("200px");
	}

	@Test
	void should_set_and_get_height() {
		tab.setHeight("50px");
		assertThat(tab.getHeight()).isEqualTo("50px");
	}

	@Test
	void should_set_and_get_class_name() {
		tab.setClassName("custom-tab");
		assertThat(tab.getClassName()).isEqualTo("custom-tab");
	}

	@Test
	void should_set_and_get_ex_class_name() {
		tab.setExClassName("extra-class");
		assertThat(tab.getExClassName()).isEqualTo("extra-class");
	}
}
