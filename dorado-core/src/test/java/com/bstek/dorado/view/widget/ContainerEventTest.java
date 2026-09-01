package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ContainerEventTest {

	@Test
	void should_return_container() {
		// Container and Component are abstract, use null for testing constructor/getters
		ContainerEvent event = new ContainerEvent(null, null);
		assertThat(event.getContainer()).isNull();
		assertThat(event.getComponent()).isNull();
	}

	@Test
	void should_return_null_component() {
		ContainerEvent event = new ContainerEvent(null, null);
		assertThat(event.getComponent()).isNull();
	}
}
