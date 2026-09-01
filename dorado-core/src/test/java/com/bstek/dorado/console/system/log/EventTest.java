package com.bstek.dorado.console.system.log;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class EventTest {

	@Test
	void should_store_logLine_and_source() {
		LogLine logLine = new LogLine("test log", "WARN");
		Object source = "monitor";
		Event event = new Event(source, logLine);

		assertThat(event.getObject()).isEqualTo(logLine);
		assertThat(event.getSource()).isEqualTo(source);
	}

	@Test
	void should_return_correct_logLine_content() {
		LogLine logLine = new LogLine("error occurred", "ERROR");
		Event event = new Event("src", logLine);

		assertThat(event.getObject().getLine()).isEqualTo("error occurred");
		assertThat(event.getObject().getLevel()).isEqualTo("ERROR");
	}
}
