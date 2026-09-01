package com.bstek.dorado.uploader.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FilterTest {

	@Test
	void should_set_and_get_title() {
		Filter filter = new Filter();
		filter.setTitle("Images");
		assertThat(filter.getTitle()).isEqualTo("Images");
	}

	@Test
	void should_set_and_get_extensions() {
		Filter filter = new Filter();
		filter.setExtensions("*.jpg;*.png;*.gif");
		assertThat(filter.getExtensions()).isEqualTo("*.jpg;*.png;*.gif");
	}

	@Test
	void should_have_null_title_by_default() {
		Filter filter = new Filter();
		assertThat(filter.getTitle()).isNull();
	}

	@Test
	void should_have_null_extensions_by_default() {
		Filter filter = new Filter();
		assertThat(filter.getExtensions()).isNull();
	}
}
