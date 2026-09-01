package com.bstek.dorado.console.authentication;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import jakarta.servlet.http.HttpServletRequest;

class OpenAuthenticationManagerTest {

	@Test
	void should_always_return_true_for_isAuthenticated() {
		OpenAuthenticationManager manager = new OpenAuthenticationManager();
		HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
		assertThat(manager.isAuthenticated(request)).isTrue();
	}

	@Test
	void should_always_return_true_for_authenticate() {
		OpenAuthenticationManager manager = new OpenAuthenticationManager();
		assertThat(manager.authenticate("user", "pass")).isTrue();
	}
}
