package com.bstek.dorado.core;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ConstantsTest {

	@Test
	void should_have_correct_default_charset() {
		assertThat(Constants.DEFAULT_CHARSET).isEqualTo("UTF-8");
	}

	@Test
	void should_have_correct_iso_date_format() {
		assertThat(Constants.ISO_DATE_FORMAT).isEqualTo("yyyy-MM-dd");
	}

	@Test
	void should_have_correct_iso_datetime_format1() {
		assertThat(Constants.ISO_DATETIME_FORMAT1).isEqualTo("yyyy-MM-dd'T'HH:mm:ss'Z'");
	}

	@Test
	void should_have_correct_iso_datetime_format2() {
		assertThat(Constants.ISO_DATETIME_FORMAT2).isEqualTo("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
	}
}
