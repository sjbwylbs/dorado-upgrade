package com.bstek.dorado.console.jdbc.exception;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class IncorrectColumnCountExceptionTest {

	@Test
	void should_create_with_default_constructor() {
		IncorrectColumnCountException ex = new IncorrectColumnCountException();
		assertThat(ex).isInstanceOf(Exception.class);
	}

	@Test
	void should_be_checked_exception() {
		IncorrectColumnCountException ex = new IncorrectColumnCountException();
		assertThat(ex).isNotInstanceOf(RuntimeException.class);
	}
}
