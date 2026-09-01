package com.bstek.dorado.uploader.util;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class ParameterUtilsTest {

	@Test
	void should_accept_valid_alphanumeric_string() {
		ParameterUtils.validateParameterCharacters("hello123");
	}

	@Test
	void should_accept_valid_string_with_hyphen() {
		ParameterUtils.validateParameterCharacters("hello-world");
	}

	@Test
	void should_accept_valid_string_with_underscore() {
		ParameterUtils.validateParameterCharacters("hello_world");
	}

	@Test
	void should_accept_valid_string_with_slash() {
		ParameterUtils.validateParameterCharacters("path/to/file");
	}

	@Test
	void should_accept_valid_string_with_dot() {
		ParameterUtils.validateParameterCharacters("file.txt");
	}

	@Test
	void should_accept_empty_string() {
		ParameterUtils.validateParameterCharacters("");
	}

	@Test
	void should_reject_string_over_128_chars() {
		String longString = "a".repeat(129);
		assertThatThrownBy(() -> ParameterUtils.validateParameterCharacters(longString))
				.isInstanceOf(SecurityException.class);
	}

	@Test
	void should_reject_string_with_space() {
		assertThatThrownBy(() -> ParameterUtils.validateParameterCharacters("hello world"))
				.isInstanceOf(SecurityException.class);
	}

	@Test
	void should_reject_string_with_special_chars() {
		assertThatThrownBy(() -> ParameterUtils.validateParameterCharacters("hello@world"))
				.isInstanceOf(SecurityException.class);
	}

	@Test
	void should_reject_string_with_semicolon() {
		assertThatThrownBy(() -> ParameterUtils.validateParameterCharacters("hello;world"))
				.isInstanceOf(SecurityException.class);
	}

	@Test
	void should_accept_exactly_128_chars() {
		String maxString = "a".repeat(128);
		ParameterUtils.validateParameterCharacters(maxString);
	}
}
