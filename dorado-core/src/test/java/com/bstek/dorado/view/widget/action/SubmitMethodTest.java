package com.bstek.dorado.view.widget.action;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SubmitMethodTest {

	@Test
	void should_have_two_values() {
		assertThat(SubmitMethod.values()).containsExactly(SubmitMethod.post, SubmitMethod.get);
	}

	@Test
	void should_parse_from_string() {
		assertThat(SubmitMethod.valueOf("post")).isEqualTo(SubmitMethod.post);
		assertThat(SubmitMethod.valueOf("get")).isEqualTo(SubmitMethod.get);
	}
}
