package com.bstek.dorado.view;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bstek.dorado.annotation.ClientEvent;
import com.bstek.dorado.annotation.ClientEvents;

class ClientEventSupportedElementTest {

	private TestClientEventElement element;

	@BeforeEach
	void setUp() {
		element = new TestClientEventElement();
	}

	@Test
	void should_return_empty_list_when_no_listeners_registered() {
		List<com.bstek.dorado.common.event.ClientEvent> listeners = element.getClientEventListeners("onClick");
		assertThat(listeners).isEmpty();
	}

	@Test
	void should_return_empty_map_when_no_listeners_registered() {
		Map<String, List<com.bstek.dorado.common.event.ClientEvent>> all = element.getAllClientEventListeners();
		assertThat(all).isEmpty();
	}

	@Test
	void should_add_and_retrieve_client_event_listener() {
		com.bstek.dorado.common.event.ClientEvent event = () -> "testFunction";
		element.addClientEventListener("onClick", event);
		List<com.bstek.dorado.common.event.ClientEvent> listeners = element.getClientEventListeners("onClick");
		assertThat(listeners).containsExactly(event);
	}

	@Test
	void should_clear_client_event_listeners() {
		com.bstek.dorado.common.event.ClientEvent event = () -> "testFunction";
		element.addClientEventListener("onClick", event);
		element.clearClientEventListeners("onClick");
		List<com.bstek.dorado.common.event.ClientEvent> listeners = element.getClientEventListeners("onClick");
		assertThat(listeners).isEmpty();
	}

	@Test
	void should_not_throw_when_clearing_nonexistent_event() {
		element.clearClientEventListeners("onNonExistent");
		assertThat(element.getClientEventListeners("onNonExistent")).isEmpty();
	}

	@Test
	void should_return_all_listeners_across_events() {
		com.bstek.dorado.common.event.ClientEvent clickEvent = () -> "clickFn";
		com.bstek.dorado.common.event.ClientEvent hoverEvent = () -> "hoverFn";
		element.addClientEventListener("onClick", clickEvent);
		element.addClientEventListener("onHover", hoverEvent);
		Map<String, List<com.bstek.dorado.common.event.ClientEvent>> all = element.getAllClientEventListeners();
		assertThat(all).containsKey("onClick").containsKey("onHover");
		assertThat(all.get("onClick")).containsExactly(clickEvent);
		assertThat(all.get("onHover")).containsExactly(hoverEvent);
	}

	@ClientEvents({ @ClientEvent(name = "onClick"), @ClientEvent(name = "onHover") })
	private static class TestClientEventElement extends ClientEventSupportedElement {
	}
}
