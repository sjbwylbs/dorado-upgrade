package com.bstek.dorado.console.system.log;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Field;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExpirableLogBufferTest {

	private ExpirableLogBuffer buffer;

	@BeforeEach
	void setUp() {
		buffer = new ExpirableLogBuffer();
	}

	@Test
	void should_not_be_expired_immediately_after_creation() {
		assertThat(buffer.isExpired()).isFalse();
	}

	@Test
	void should_be_expired_after_maxIdle_time() throws Exception {
		Field lastAccessField = ExpirableLogBuffer.class.getDeclaredField("lastAccess");
		lastAccessField.setAccessible(true);
		lastAccessField.set(buffer, System.currentTimeMillis() - (31 * 60 * 1000)); // 31 min ago
		assertThat(buffer.isExpired()).isTrue();
	}

	@Test
	void should_not_be_expired_when_called_recently() {
		buffer.isEmpty();
		assertThat(buffer.isExpired()).isFalse();
	}

	@Test
	void should_return_null_when_empty() {
		assertThat(buffer.getLastLines()).isNull();
	}

	@Test
	void should_return_lines_and_clear_after_getLastLines() {
		LogLine line = new LogLine("test", "INFO");
		Event event = new Event("src", line);
		buffer.onPush(event);
		List<LogLine> lines = buffer.getLastLines();
		assertThat(lines).hasSize(1);
		assertThat(lines.get(0).getLine()).isEqualTo("test");
		assertThat(buffer.getLastLines()).isNull();
	}

	@Test
	void should_touch_after_isEmpty() {
		buffer.isEmpty();
		assertThat(buffer.isExpired()).isFalse();
	}

	@Test
	void should_touch_after_getLastLines() {
		buffer.getLastLines();
		assertThat(buffer.isExpired()).isFalse();
	}
}
