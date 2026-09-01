package com.bstek.dorado.common.event;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ClientEventDefinitionTest {

	private ClientEventDefinition definition;

	@BeforeEach
	void setUp() {
		definition = new ClientEventDefinition();
	}

	@Test
	void should_set_implType_to_DefaultClientEvent_in_constructor() {
		assertThat(definition.getImplType()).isEqualTo(DefaultClientEvent.class);
	}

	@Test
	void should_set_and_get_name() {
		definition.setName("onClick");
		assertThat(definition.getName()).isEqualTo("onClick");
	}

	@Test
	void should_return_null_name_by_default() {
		assertThat(definition.getName()).isNull();
	}

	@Test
	void should_set_and_get_signature_via_property() {
		definition.setSignature("self,arg");
		assertThat(definition.getSignature()).isEqualTo("self,arg");
	}

	@Test
	void should_return_null_signature_by_default() {
		assertThat(definition.getSignature()).isNull();
	}

	@Test
	void should_set_and_get_script_via_property() {
		definition.setScript("alert('test')");
		assertThat(definition.getScript()).isEqualTo("alert('test')");
	}

	@Test
	void should_return_null_script_by_default() {
		assertThat(definition.getScript()).isNull();
	}

	@Test
	void should_store_script_as_any_object() {
		Object scriptObj = new Object();
		definition.setScript(scriptObj);
		assertThat(definition.getScript()).isSameAs(scriptObj);
	}

	@Test
	void should_store_signature_as_property() {
		definition.setSignature("self,arg,event");
		// Verify it's stored as a property named "signature"
		assertThat(definition.getProperty("signature")).isEqualTo("self,arg,event");
	}

	@Test
	void should_store_script_as_property() {
		definition.setScript("return true;");
		// Verify it's stored as a property named "script"
		assertThat(definition.getProperty("script")).isEqualTo("return true;");
	}
}
