package com.bstek.dorado.idesupport.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ClientEventTest {

	@Test
	void should_set_and_get_name() {
		ClientEvent event = new ClientEvent();
		event.setName("onClick");
		assertThat(event.getName()).isEqualTo("onClick");
	}

	@Test
	void should_set_and_get_parameters() {
		ClientEvent event = new ClientEvent();
		String[] params = {"arg1", "arg2"};
		event.setParameters(params);
		assertThat(event.getParameters()).containsExactly("arg1", "arg2");
	}

	@Test
	void should_have_default_client_types_zero() {
		ClientEvent event = new ClientEvent();
		assertThat(event.getClientTypes()).isEqualTo(0);
	}

	@Test
	void should_set_and_get_client_types() {
		ClientEvent event = new ClientEvent();
		event.setClientTypes(3);
		assertThat(event.getClientTypes()).isEqualTo(3);
	}

	@Test
	void should_have_default_deprecated_false() {
		ClientEvent event = new ClientEvent();
		assertThat(event.isDeprecated()).isFalse();
	}

	@Test
	void should_set_and_get_deprecated() {
		ClientEvent event = new ClientEvent();
		event.setDeprecated(true);
		assertThat(event.isDeprecated()).isTrue();
	}

	@Test
	void should_set_and_get_reserve() {
		ClientEvent event = new ClientEvent();
		event.setReserve("reserved-data");
		assertThat(event.getReserve()).isEqualTo("reserved-data");
	}

	@Test
	void should_set_and_get_user_data() {
		ClientEvent event = new ClientEvent();
		Object userData = new Object();
		event.setUserData(userData);
		assertThat(event.getUserData()).isSameAs(userData);
	}

	@Test
	void should_have_null_defaults() {
		ClientEvent event = new ClientEvent();
		assertThat(event.getName()).isNull();
		assertThat(event.getParameters()).isNull();
		assertThat(event.getReserve()).isNull();
		assertThat(event.getUserData()).isNull();
	}
}
