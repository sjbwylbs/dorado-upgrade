package com.bstek.dorado.idesupport;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ConstantsTest {

	@Test
	void should_have_rule_config_version_1_1() {
		assertThat(Constants.RULE_CONFIG_VERSION).isEqualTo("1.1");
	}

	@Test
	void should_not_be_null() {
		assertThat(Constants.RULE_CONFIG_VERSION).isNotNull();
	}
}
