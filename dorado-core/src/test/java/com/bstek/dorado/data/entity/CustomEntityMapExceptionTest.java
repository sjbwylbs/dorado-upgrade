package com.bstek.dorado.data.entity;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CustomEntityMapExceptionTest {

	@Test
	void should_contain_message_and_cause() {
		RuntimeException cause = new RuntimeException("root cause");
		CustomEntityMapException ex = new CustomEntityMapException("mapping failed", cause);
		assertThat(ex.getMessage()).isEqualTo("mapping failed");
		assertThat(ex.getCause()).isEqualTo(cause);
	}

	@Test
	void should_contain_cause_only() {
		RuntimeException cause = new RuntimeException("root cause");
		CustomEntityMapException ex = new CustomEntityMapException(cause);
		assertThat(ex.getCause()).isEqualTo(cause);
	}

	@Test
	void should_be_runtime_exception() {
		RuntimeException cause = new RuntimeException("root cause");
		CustomEntityMapException ex = new CustomEntityMapException(cause);
		assertThat(ex).isInstanceOf(RuntimeException.class);
	}
}
