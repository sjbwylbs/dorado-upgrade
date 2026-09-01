package com.bstek.dorado.common.event;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Map;

import org.junit.jupiter.api.Test;

class ClientEventRegistryTest {

	// Each test uses a unique class to avoid static cache conflicts
	public static class TestSupportedA implements ClientEventSupported {
		@Override
		public void addClientEventListener(String eventName, ClientEvent eventListener) {
		}

		@Override
		public java.util.List<ClientEvent> getClientEventListeners(String eventName) {
			return java.util.Collections.emptyList();
		}

		@Override
		public void clearClientEventListeners(String eventName) {
		}

		@Override
		public Map<String, java.util.List<ClientEvent>> getAllClientEventListeners() {
			return java.util.Collections.emptyMap();
		}
	}

	public static class TestSupportedB implements ClientEventSupported {
		@Override
		public void addClientEventListener(String eventName, ClientEvent eventListener) {
		}

		@Override
		public java.util.List<ClientEvent> getClientEventListeners(String eventName) {
			return java.util.Collections.emptyList();
		}

		@Override
		public void clearClientEventListeners(String eventName) {
		}

		@Override
		public Map<String, java.util.List<ClientEvent>> getAllClientEventListeners() {
			return java.util.Collections.emptyMap();
		}
	}

	public static class TestSupportedC implements ClientEventSupported {
		@Override
		public void addClientEventListener(String eventName, ClientEvent eventListener) {
		}

		@Override
		public java.util.List<ClientEvent> getClientEventListeners(String eventName) {
			return java.util.Collections.emptyList();
		}

		@Override
		public void clearClientEventListeners(String eventName) {
		}

		@Override
		public Map<String, java.util.List<ClientEvent>> getAllClientEventListeners() {
			return java.util.Collections.emptyMap();
		}
	}

	public static class TestSupportedD implements ClientEventSupported {
		@Override
		public void addClientEventListener(String eventName, ClientEvent eventListener) {
		}

		@Override
		public java.util.List<ClientEvent> getClientEventListeners(String eventName) {
			return java.util.Collections.emptyList();
		}

		@Override
		public void clearClientEventListeners(String eventName) {
		}

		@Override
		public Map<String, java.util.List<ClientEvent>> getAllClientEventListeners() {
			return java.util.Collections.emptyMap();
		}
	}

	public static class TestSupportedE implements ClientEventSupported {
		@Override
		public void addClientEventListener(String eventName, ClientEvent eventListener) {
		}

		@Override
		public java.util.List<ClientEvent> getClientEventListeners(String eventName) {
			return java.util.Collections.emptyList();
		}

		@Override
		public void clearClientEventListeners(String eventName) {
		}

		@Override
		public Map<String, java.util.List<ClientEvent>> getAllClientEventListeners() {
			return java.util.Collections.emptyMap();
		}
	}

	@Test
	void should_register_and_retrieve_client_event() {
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(TestSupportedA.class, "testEventA");
		ClientEventRegistry.registerClientEvent(info);

		ClientEventRegisterInfo retrieved = ClientEventRegistry.getClientEventRegisterInfo(TestSupportedA.class,
				"testEventA");
		assertThat(retrieved).isNotNull();
		assertThat(retrieved.getName()).isEqualTo("testEventA");
		assertThat(retrieved.getType()).isEqualTo(TestSupportedA.class);
	}

	@Test
	void should_return_null_for_unregistered_event() {
		ClientEventRegisterInfo retrieved = ClientEventRegistry.getClientEventRegisterInfo(TestSupportedB.class,
				"nonExistentEvent");
		assertThat(retrieved).isNull();
	}

	@Test
	void should_throw_when_registering_duplicate_event() {
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(TestSupportedC.class, "dupEvent");
		ClientEventRegistry.registerClientEvent(info);

		ClientEventRegisterInfo duplicate = new ClientEventRegisterInfo(TestSupportedC.class, "dupEvent");
		assertThatThrownBy(() -> ClientEventRegistry.registerClientEvent(duplicate))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("already registered");
	}

	@Test
	void should_throw_when_type_is_null() {
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(null, "eventName");
		assertThatThrownBy(() -> ClientEventRegistry.registerClientEvent(info))
				.isInstanceOf(NullPointerException.class);
	}

	@Test
	void should_throw_when_event_name_is_empty() {
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(TestSupportedD.class, "");
		assertThatThrownBy(() -> ClientEventRegistry.registerClientEvent(info))
				.isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void should_return_own_event_infos() {
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(TestSupportedE.class, "ownEvent");
		ClientEventRegistry.registerClientEvent(info);

		Map<String, ClientEventRegisterInfo> ownInfos = ClientEventRegistry
				.getOwnClientEventRegisterInfos(TestSupportedE.class);
		assertThat(ownInfos).isNotNull();
		assertThat(ownInfos).containsKey("ownEvent");
	}

	@Test
	void should_return_infos_for_type_with_no_events() {
		// TestSupportedB has no registered events, should return empty or non-null map
		Map<String, ClientEventRegisterInfo> infos = ClientEventRegistry
				.getClientEventRegisterInfos(TestSupportedB.class);
		assertThat(infos).isNotNull();
	}
}
