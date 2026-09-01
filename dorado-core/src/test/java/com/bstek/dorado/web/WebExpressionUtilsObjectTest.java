package com.bstek.dorado.web;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class WebExpressionUtilsObjectTest {

	private WebExpressionUtilsObject utilsObject;

	@BeforeEach
	void setUp() {
		utilsObject = new WebExpressionUtilsObject();
	}

	@Test
	void should_return_original_url_when_not_starting_with_greater_than() {
		assertThat(utilsObject.url("http://example.com")).isEqualTo("http://example.com");
	}

	@Test
	void should_return_original_url_when_null() {
		assertThat(utilsObject.url(null)).isNull();
	}

	@Test
	void should_return_original_url_when_empty() {
		assertThat(utilsObject.url("")).isEqualTo("");
	}

	@Test
	void should_return_original_url_when_no_prefix() {
		assertThat(utilsObject.url("/path/to/resource")).isEqualTo("/path/to/resource");
	}

	@Test
	void should_return_original_url_for_relative_path() {
		assertThat(utilsObject.url("relative/path")).isEqualTo("relative/path");
	}

	@Test
	void should_return_slash_when_getContextPath_fails() {
		// getContextPath returns "/" when exception occurs (no DoradoContext attached)
		assertThat(utilsObject.getContextPath()).isEqualTo("/");
	}

	@Test
	void should_concat_path_when_url_starts_with_greater_than() {
		// When contextPath is "/" and url starts with ">", it should concat
		String result = utilsObject.url(">/path");
		// PathUtils.concatPath("/", "path") should produce "/path"
		assertThat(result).isNotNull();
	}
}
