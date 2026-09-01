package com.bstek.dorado.console.authentication;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import jakarta.servlet.http.HttpServletRequest;

class ForbiddenAuthenticationManagerTest {

	@Test
	void should_always_return_false_for_isAuthenticated() {
		ForbiddenAuthenticationManager manager = new ForbiddenAuthenticationManager();
		HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
		assertThat(manager.isAuthenticated(request)).isFalse();
	}

	@Test
	void should_always_return_false_for_authenticate() {
		ForbiddenAuthenticationManager manager = new ForbiddenAuthenticationManager();
		assertThat(manager.authenticate("user", "pass")).isFalse();
	}
}
