package com.bstek.dorado.common.event;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.common.ClientType;

class ClientEventRegisterInfoTest {

	@Test
	void should_create_with_type_name_and_signature() {
		String[] signature = { "self", "arg", "event" };
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(Object.class, "onClick", signature);

		assertThat(info.getType()).isEqualTo(Object.class);
		assertThat(info.getName()).isEqualTo("onClick");
		assertThat(info.getSignature()).isEqualTo(signature);
	}

	@Test
	void should_create_with_type_and_name_only() {
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(Object.class, "onLoad");

		assertThat(info.getType()).isEqualTo(Object.class);
		assertThat(info.getName()).isEqualTo("onLoad");
		assertThat(info.getSignature()).containsExactly("self", "arg");
	}

	@Test
	void should_use_default_signature_when_null_provided() {
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(Object.class, "onLoad", null);

		assertThat(info.getSignature()).containsExactly("self", "arg");
	}

	@Test
	void should_set_and_get_deprecated() {
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(Object.class, "onLoad");
		assertThat(info.isDeprecated()).isFalse();

		info.setDeprecated(true);
		assertThat(info.isDeprecated()).isTrue();
	}

	@Test
	void should_set_and_get_visible() {
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(Object.class, "onLoad");
		assertThat(info.isVisible()).isTrue();

		info.setVisible(false);
		assertThat(info.isVisible()).isFalse();
	}

	@Test
	void should_set_and_get_clientTypes() {
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(Object.class, "onLoad");
		assertThat(info.getClientTypes()).isEqualTo(0);

		info.setClientTypes(ClientType.DESKTOP | ClientType.TOUCH);
		assertThat(info.getClientTypes()).isEqualTo(ClientType.DESKTOP | ClientType.TOUCH);
	}

	@Test
	void should_use_custom_signature() {
		String[] customSig = { "sender", "data" };
		ClientEventRegisterInfo info = new ClientEventRegisterInfo(String.class, "onChange", customSig);

		assertThat(info.getSignature()).isEqualTo(customSig);
		assertThat(info.getType()).isEqualTo(String.class);
	}
}
