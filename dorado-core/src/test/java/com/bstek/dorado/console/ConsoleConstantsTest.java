package com.bstek.dorado.console;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ConsoleConstantsTest {

	@Test
	void should_have_correct_log_directory_path() {
		assertThat(Constants.LOG_DIRECTORY_PATH).isEqualTo("dorado.console.logDirectoryPath");
	}

	@Test
	void should_have_correct_login_status_key() {
		assertThat(Constants.S_DORADO_CONSOLE_LOGIN_STATUS).isEqualTo("com.bstek.dorado.console.login.status");
	}

	@Test
	void should_have_correct_request_start_time_key() {
		assertThat(Constants.R_DORADO_CONSOLE_REQUEST_STARTTIME).isEqualTo("com.bstek.dorado.console.request.startTime");
	}

	@Test
	void should_have_correct_login_view_path() {
		assertThat(Constants.DORADO_CONSOLE_LOGIN_VIEW_PATH).isEqualTo("com.bstek.dorado.console.Login.d");
	}
}
