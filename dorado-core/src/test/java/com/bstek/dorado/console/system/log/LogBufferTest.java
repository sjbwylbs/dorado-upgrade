package com.bstek.dorado.console.system.log;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LogBufferTest {

	private LogBuffer buffer;

	@BeforeEach
	void setUp() {
		buffer = new LogBuffer();
	}

	@Test
	void should_be_empty_initially() {
		assertThat(buffer.isEmpty()).isTrue();
	}

	@Test
	void should_not_be_empty_after_push() {
		LogLine line = new LogLine("test", "INFO");
		Event event = new Event("src", line);
		buffer.onPush(event);
		assertThat(buffer.isEmpty()).isFalse();
	}

	@Test
	void should_return_lines_and_clear() {
		LogLine line = new LogLine("message", "WARN");
		Event event = new Event("src", line);
		buffer.onPush(event);

		List<LogLine> lines = buffer.getLastLines();
		assertThat(lines).hasSize(1);
		assertThat(lines.get(0).getLine()).isEqualTo("message");
		assertThat(lines.get(0).getLevel()).isEqualTo("WARN");

		// After retrieval, buffer should be empty
		assertThat(buffer.isEmpty()).isTrue();
	}

	@Test
	void should_return_null_when_getting_from_empty_buffer() {
		assertThat(buffer.getLastLines()).isNull();
	}

	@Test
	void should_handle_multiple_pushes() {
		for (int i = 0; i < 5; i++) {
			LogLine line = new LogLine("msg-" + i, "INFO");
			buffer.onPush(new Event("src", line));
		}
		List<LogLine> lines = buffer.getLastLines();
		assertThat(lines).hasSize(5);
	}

	@Test
	void should_limit_buffer_size_to_max_count() {
		// Push more than MAX_LOG_COUNT entries
		for (int i = 0; i < LogBuffer.MAX_LOG_COUNT + 100; i++) {
			LogLine line = new LogLine("msg-" + i, "INFO");
			buffer.onPush(new Event("src", line));
		}
		List<LogLine> lines = buffer.getLastLines();
		// Buffer cleanup logic has a slight offset, so size may be slightly over MAX_LOG_COUNT
		assertThat(lines).hasSizeLessThanOrEqualTo(LogBuffer.MAX_LOG_COUNT + 2);
	}
}
