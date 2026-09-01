package com.bstek.dorado.core;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ApplicationContextNotInitExceptionTest {

	@Test
	void should_create_exception_with_message() {
		String message = "Application context not initialized";
		ApplicationContextNotInitException exception = new ApplicationContextNotInitException(message);

		assertThat(exception).isInstanceOf(RuntimeException.class);
		assertThat(exception.getMessage()).isEqualTo(message);
	}

	@Test
	void should_create_exception_with_null_message() {
		ApplicationContextNotInitException exception = new ApplicationContextNotInitException(null);

		assertThat(exception.getMessage()).isNull();
	}
}
