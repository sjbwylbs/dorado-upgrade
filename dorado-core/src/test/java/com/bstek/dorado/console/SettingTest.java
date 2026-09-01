package com.bstek.dorado.console;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import com.bstek.dorado.console.authentication.AuthenticationManager;

import jakarta.servlet.http.HttpServletRequest;

class SettingTest {

	@AfterEach
	void tearDown() {
		Setting.setAuthenticationManager(null);
		Setting.setStartTime(0);
		Setting.setListenerActiveState(false);
	}

	@Test
	void should_return_null_authenticationManager_by_default() {
		Setting.setAuthenticationManager(null);
		assertThat(Setting.getAuthenticationManager()).isNull();
	}

	@Test
	void should_set_and_get_authenticationManager() {
		AuthenticationManager am = new AuthenticationManager() {
			@Override
			public boolean authenticate(String name, String password) {
				return false;
			}

			@Override
			public boolean isAuthenticated(HttpServletRequest request) {
				return false;
			}
		};
		Setting.setAuthenticationManager(am);
		assertThat(Setting.getAuthenticationManager()).isSameAs(am);
	}

	@Test
	void should_set_and_get_startTime() {
		Setting.setStartTime(12345L);
		assertThat(Setting.getStartTime()).isEqualTo(12345L);
	}

	@Test
	void should_return_false_for_listenerActiveState_by_default() {
		Setting.setListenerActiveState(false);
		assertThat(Setting.getListenerActiveState()).isFalse();
	}

	@Test
	void should_set_and_get_listenerActiveState() {
		Setting.setListenerActiveState(true);
		assertThat(Setting.getListenerActiveState()).isTrue();
	}
}
