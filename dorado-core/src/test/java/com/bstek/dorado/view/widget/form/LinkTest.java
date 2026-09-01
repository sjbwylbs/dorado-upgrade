package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LinkTest {

	private Link link;

	@BeforeEach
	void setUp() {
		link = new Link();
	}

	@Test
	void should_return_null_href_by_default() {
		assertThat(link.getHref()).isNull();
	}

	@Test
	void should_return_null_target_by_default() {
		assertThat(link.getTarget()).isNull();
	}

	@Test
	void should_set_and_get_href() {
		link.setHref("https://example.com");
		assertThat(link.getHref()).isEqualTo("https://example.com");
	}

	@Test
	void should_set_and_get_target() {
		link.setTarget("_blank");
		assertThat(link.getTarget()).isEqualTo("_blank");
	}

	@Test
	void should_inherit_text_property_from_label() {
		link.setText("Click here");
		assertThat(link.getText()).isEqualTo("Click here");
	}
}
