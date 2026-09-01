package com.bstek.dorado.common.event;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ClientEventHolderTest {

	public static class TestSupported implements ClientEventSupported {
		@Override
		public void addClientEventListener(String eventName, ClientEvent eventListener) {
		}

		@Override
		public List<ClientEvent> getClientEventListeners(String eventName) {
			return java.util.Collections.emptyList();
		}

		@Override
		public void clearClientEventListeners(String eventName) {
		}

		@Override
		public Map<String, List<ClientEvent>> getAllClientEventListeners() {
			return java.util.Collections.emptyMap();
		}
	}

	private ClientEventHolder holder;

	@BeforeEach
	void setUp() {
		// Register the test event so checkEventAvailable passes
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(TestSupported.class, "onClick");
		try {
			ClientEventRegistry.registerClientEvent(info);
		} catch (IllegalArgumentException e) {
			// Already registered from a previous test run - ignore
		}

		ClientEventRegisterInfo info2 = new ClientEventRegisterInfo(TestSupported.class, "onLoad");
		try {
			ClientEventRegistry.registerClientEvent(info2);
		} catch (IllegalArgumentException e) {
			// Already registered
		}

		holder = new ClientEventHolder(TestSupported.class);
	}

	@Test
	void should_create_holder_with_class() {
		ClientEventHolder h = new ClientEventHolder(TestSupported.class);
		assertThat(h.getAllClientEventListeners()).isEmpty();
	}

	@Test
	void should_create_holder_with_owner_instance() {
		TestSupported owner = new TestSupported();
		ClientEventHolder h = new ClientEventHolder(owner);
		assertThat(h.getAllClientEventListeners()).isEmpty();
	}

	@Test
	void should_add_and_retrieve_event_listener() {
		ClientEvent event = new DefaultClientEvent("alert('clicked')");
		holder.addClientEventListener("onClick", event);

		List<ClientEvent> listeners = holder.getClientEventListeners("onClick");
		assertThat(listeners).hasSize(1);
		assertThat(listeners.get(0)).isSameAs(event);
	}

	@Test
	void should_add_multiple_listeners_for_same_event() {
		ClientEvent event1 = new DefaultClientEvent("script1");
		ClientEvent event2 = new DefaultClientEvent("script2");
		holder.addClientEventListener("onClick", event1);
		holder.addClientEventListener("onClick", event2);

		List<ClientEvent> listeners = holder.getClientEventListeners("onClick");
		assertThat(listeners).hasSize(2);
		assertThat(listeners).containsExactly(event1, event2);
	}

	@Test
	void should_return_empty_list_for_event_with_no_listeners() {
		List<ClientEvent> listeners = holder.getClientEventListeners("onClick");
		assertThat(listeners).isEmpty();
	}

	@Test
	void should_throw_for_unregistered_event() {
		ClientEvent event = new DefaultClientEvent("test");
		assertThatThrownBy(() -> holder.addClientEventListener("unknownEvent", event))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Unrecognized client event");
	}

	@Test
	void should_clear_listeners_for_event() {
		holder.addClientEventListener("onClick", new DefaultClientEvent("script1"));
		holder.addClientEventListener("onClick", new DefaultClientEvent("script2"));
		assertThat(holder.getClientEventListeners("onClick")).hasSize(2);

		holder.clearClientEventListeners("onClick");
		assertThat(holder.getClientEventListeners("onClick")).isEmpty();
	}

	@Test
	void should_not_fail_when_clearing_non_existent_event() {
		holder.clearClientEventListeners("nonExistent");
		// Should not throw
	}

	@Test
	void should_return_all_listeners_map() {
		holder.addClientEventListener("onClick", new DefaultClientEvent("clickScript"));
		holder.addClientEventListener("onLoad", new DefaultClientEvent("loadScript"));

		Map<String, List<ClientEvent>> all = holder.getAllClientEventListeners();
		assertThat(all).hasSize(2);
		assertThat(all).containsKeys("onClick", "onLoad");
	}

	@Test
	void should_return_empty_map_when_no_listeners_added() {
		Map<String, List<ClientEvent>> all = holder.getAllClientEventListeners();
		assertThat(all).isEmpty();
	}
}
