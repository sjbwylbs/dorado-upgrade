package com.bstek.dorado.idesupport.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ReferenceTest {

	@Test
	void should_store_rule_and_property() {
		Rule rule = new Rule("testRule");
		Reference ref = new Reference(rule, "name");
		assertThat(ref.getRule()).isEqualTo(rule);
		assertThat(ref.getProperty()).isEqualTo("name");
	}

	@Test
	void should_allow_null_property() {
		Rule rule = new Rule("testRule");
		Reference ref = new Reference(rule, null);
		assertThat(ref.getRule()).isEqualTo(rule);
		assertThat(ref.getProperty()).isNull();
	}

	@Test
	void should_allow_null_rule() {
		Reference ref = new Reference(null, "prop");
		assertThat(ref.getRule()).isNull();
		assertThat(ref.getProperty()).isEqualTo("prop");
	}
}
