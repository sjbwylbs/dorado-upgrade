package com.bstek.dorado.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

class ConfigUtilsTest {

	@AfterEach
	void tearDown() {
		// Reset the state after each test
		while (ConfigUtils.isDuringBuildTemplate()) {
			ConfigUtils.setDuringBuildTemplate(false);
		}
	}

	@Test
	void should_return_false_initially() {
		assertThat(ConfigUtils.isDuringBuildTemplate()).isFalse();
	}

	@Test
	void should_return_true_after_set_true() {
		ConfigUtils.setDuringBuildTemplate(true);

		assertThat(ConfigUtils.isDuringBuildTemplate()).isTrue();
	}

	@Test
	void should_return_false_after_set_true_then_false() {
		ConfigUtils.setDuringBuildTemplate(true);
		ConfigUtils.setDuringBuildTemplate(false);

		assertThat(ConfigUtils.isDuringBuildTemplate()).isFalse();
	}

	@Test
	void should_require_matching_false_calls_for_multiple_true_calls() {
		ConfigUtils.setDuringBuildTemplate(true);
		ConfigUtils.setDuringBuildTemplate(true);
		ConfigUtils.setDuringBuildTemplate(true);

		assertThat(ConfigUtils.isDuringBuildTemplate()).isTrue();

		ConfigUtils.setDuringBuildTemplate(false);
		assertThat(ConfigUtils.isDuringBuildTemplate()).isTrue();

		ConfigUtils.setDuringBuildTemplate(false);
		assertThat(ConfigUtils.isDuringBuildTemplate()).isTrue();

		ConfigUtils.setDuringBuildTemplate(false);
		assertThat(ConfigUtils.isDuringBuildTemplate()).isFalse();
	}

	@Test
	void should_not_fail_when_set_false_without_matching_true() {
		// Should not throw
		ConfigUtils.setDuringBuildTemplate(false);

		assertThat(ConfigUtils.isDuringBuildTemplate()).isFalse();
	}

	@Test
	void should_have_non_null_ignore_value() {
		assertThat(ConfigUtils.IGNORE_VALUE).isNotNull();
	}

	@Test
	void should_have_unique_ignore_value() {
		Object value1 = ConfigUtils.IGNORE_VALUE;
		Object value2 = ConfigUtils.IGNORE_VALUE;
		assertThat(value1).isSameAs(value2);
	}

	@Test
	void should_be_thread_local() throws InterruptedException {
		ConfigUtils.setDuringBuildTemplate(true);

		final boolean[] otherThreadResult = new boolean[1];
		Thread otherThread = new Thread(() -> {
			otherThreadResult[0] = ConfigUtils.isDuringBuildTemplate();
		});
		otherThread.start();
		otherThread.join();

		assertThat(otherThreadResult[0]).isFalse();
		assertThat(ConfigUtils.isDuringBuildTemplate()).isTrue();
	}
}
