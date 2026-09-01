package com.bstek.dorado.console.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class AccessDeniedExceptionTest {

	@Test
	void should_have_correct_login_timeout_message() {
		assertThat(AccessDeniedException.LOGIN_TIME_OUT_MESSAGE).isEqualTo("登陆已超时！");
	}

	@Test
	void should_create_with_message() {
		AccessDeniedException ex = new AccessDeniedException("Access denied");
		assertThat(ex.getMessage()).isEqualTo("Access denied");
	}

	@Test
	void should_create_with_message_and_cause() {
		Throwable cause = new RuntimeException("root cause");
		AccessDeniedException ex = new AccessDeniedException("Access denied", cause);
		assertThat(ex.getMessage()).isEqualTo("Access denied");
		assertThat(ex.getCause()).isEqualTo(cause);
	}

	@Test
	void should_be_runtime_exception() {
		assertThat(new AccessDeniedException("test")).isInstanceOf(RuntimeException.class);
	}

	@Test
	void should_throw_with_correct_message() {
		assertThatThrownBy(() -> {
			throw new AccessDeniedException("forbidden");
		}).hasMessage("forbidden");
	}
}
