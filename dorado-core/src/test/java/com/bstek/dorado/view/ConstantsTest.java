package com.bstek.dorado.view;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Constructor;
import java.lang.reflect.Modifier;

import org.junit.jupiter.api.Test;

class ConstantsTest {

	@Test
	void should_have_correct_view_config_type_xml() {
		assertThat(Constants.VIEW_CONFIG_TYPE_XML).isEqualTo("xml");
	}

	@Test
	void should_have_correct_scope_view_prefix() {
		assertThat(Constants.SCOPE_VIEW_PREFIX).isEqualTo("View:");
	}

	@Test
	void should_not_be_instantiable() throws Exception {
		Constructor<Constants> constructor = Constants.class.getDeclaredConstructor();
		assertThat(Modifier.isPrivate(constructor.getModifiers())).isTrue();
	}
}
