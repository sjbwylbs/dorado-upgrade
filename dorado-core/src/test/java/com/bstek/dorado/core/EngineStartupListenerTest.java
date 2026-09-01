package com.bstek.dorado.core;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class EngineStartupListenerTest {

	/**
	 * Minimal concrete implementation for testing.
	 */
	private static class TestEngineStartupListener extends EngineStartupListener {
		private boolean startupCalled = false;

		@Override
		public void onStartup() throws Exception {
			startupCalled = true;
		}
	}

	@Test
	void should_have_default_order_of_999() {
		TestEngineStartupListener listener = new TestEngineStartupListener();

		assertThat(listener.getOrder()).isEqualTo(999);
	}

	@Test
	void should_set_and_get_order() {
		TestEngineStartupListener listener = new TestEngineStartupListener();
		listener.setOrder(10);

		assertThat(listener.getOrder()).isEqualTo(10);
	}

	@Test
	void should_set_order_to_zero() {
		TestEngineStartupListener listener = new TestEngineStartupListener();
		listener.setOrder(0);

		assertThat(listener.getOrder()).isEqualTo(0);
	}

	@Test
	void should_set_order_to_negative_value() {
		TestEngineStartupListener listener = new TestEngineStartupListener();
		listener.setOrder(-1);

		assertThat(listener.getOrder()).isEqualTo(-1);
	}
}
