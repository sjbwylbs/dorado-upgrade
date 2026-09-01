package com.bstek.dorado.data;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class IllegalJsonFormatExceptionTest {

	@Test
	void should_create_with_no_args() {
		IllegalJsonFormatException ex = new IllegalJsonFormatException();
		assertThat(ex).isInstanceOf(RuntimeException.class);
	}

	@Test
	void should_create_with_message() {
		IllegalJsonFormatException ex = new IllegalJsonFormatException("invalid json");
		assertThat(ex.getMessage()).isEqualTo("invalid json");
	}

	@Test
	void should_create_with_message_and_cause() {
		RuntimeException cause = new RuntimeException("root cause");
		IllegalJsonFormatException ex = new IllegalJsonFormatException("invalid json", cause);
		assertThat(ex.getMessage()).isEqualTo("invalid json");
		assertThat(ex.getCause()).isEqualTo(cause);
	}

	@Test
	void should_create_with_cause() {
		RuntimeException cause = new RuntimeException("root cause");
		IllegalJsonFormatException ex = new IllegalJsonFormatException(cause);
		assertThat(ex.getCause()).isEqualTo(cause);
	}
}
