package com.bstek.dorado.console.system.log;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LogLineTest {

	@Test
	void should_create_empty_logLine_with_default_constructor() {
		LogLine logLine = new LogLine();
		assertThat(logLine.getLine()).isNull();
		assertThat(logLine.getLevel()).isNull();
	}

	@Test
	void should_create_logLine_with_args_constructor() {
		LogLine logLine = new LogLine("test message", "INFO");
		assertThat(logLine.getLine()).isEqualTo("test message");
		assertThat(logLine.getLevel()).isEqualTo("INFO");
	}

	@Test
	void should_set_and_get_line() {
		LogLine logLine = new LogLine();
		logLine.setLine("new message");
		assertThat(logLine.getLine()).isEqualTo("new message");
	}

	@Test
	void should_set_and_get_level() {
		LogLine logLine = new LogLine();
		logLine.setLevel("ERROR");
		assertThat(logLine.getLevel()).isEqualTo("ERROR");
	}
}
