package com.bstek.dorado.common.event;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DefaultClientEventTest {

	@Test
	void should_create_empty_event_with_default_constructor() {
		DefaultClientEvent event = new DefaultClientEvent();
		assertThat(event.getScript()).isNull();
		assertThat(event.getSignature()).isNull();
	}

	@Test
	void should_create_event_with_script() {
		DefaultClientEvent event = new DefaultClientEvent("alert('hello')");
		assertThat(event.getScript()).isEqualTo("alert('hello')");
		assertThat(event.getSignature()).isNull();
	}

	@Test
	void should_create_event_with_signature_and_script() {
		DefaultClientEvent event = new DefaultClientEvent("self,arg", "return self.getValue()");
		assertThat(event.getSignature()).isEqualTo("self,arg");
		assertThat(event.getScript()).isEqualTo("return self.getValue()");
	}

	@Test
	void should_set_and_get_script() {
		DefaultClientEvent event = new DefaultClientEvent();
		event.setScript("console.log('test')");
		assertThat(event.getScript()).isEqualTo("console.log('test')");
	}

	@Test
	void should_set_and_get_signature() {
		DefaultClientEvent event = new DefaultClientEvent();
		event.setSignature("self,arg,event");
		assertThat(event.getSignature()).isEqualTo("self,arg,event");
	}

	@Test
	void should_implement_ClientEvent_interface() {
		DefaultClientEvent event = new DefaultClientEvent("test");
		ClientEvent clientEvent = event;
		assertThat(clientEvent.getScript()).isEqualTo("test");
	}

	@Test
	void should_implement_DynaSignatureClientEvent_interface() {
		DefaultClientEvent event = new DefaultClientEvent("sig", "script");
		DynaSignatureClientEvent dynaEvent = event;
		assertThat(dynaEvent.getSignature()).isEqualTo("sig");
		assertThat(dynaEvent.getScript()).isEqualTo("script");
	}

	@Test
	void should_allow_null_script() {
		DefaultClientEvent event = new DefaultClientEvent();
		event.setScript(null);
		assertThat(event.getScript()).isNull();
	}

	@Test
	void should_allow_null_signature() {
		DefaultClientEvent event = new DefaultClientEvent();
		event.setSignature(null);
		assertThat(event.getSignature()).isNull();
	}
}
