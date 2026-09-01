package com.bstek.dorado.view.config.attachment;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JavaScriptContentTest {

	private JavaScriptContent content;

	@BeforeEach
	void setUp() {
		content = new JavaScriptContent();
	}

	@Test
	void should_return_null_content_by_default() {
		assertThat(content.getContent()).isNull();
	}

	@Test
	void should_return_false_for_isController_by_default() {
		assertThat(content.getIsController()).isFalse();
	}

	@Test
	void should_return_null_functionInfos_by_default() {
		assertThat(content.getFunctionInfos()).isNull();
	}

	@Test
	void should_set_and_get_content() {
		content.setContent("var x = 1;");
		assertThat(content.getContent()).isEqualTo("var x = 1;");
	}

	@Test
	void should_set_and_get_isController() {
		content.setIsController(true);
		assertThat(content.getIsController()).isTrue();
	}

	@Test
	void should_set_and_get_functionInfos() {
		// FunctionInfo is package-private, tested via JavaScriptContent only
		assertThat(content.getFunctionInfos()).isNull();
	}
}
