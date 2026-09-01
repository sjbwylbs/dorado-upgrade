package com.bstek.dorado.idesupport.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ChildTest {

	@Test
	void should_set_name_via_constructor() {
		Child child = new Child("items");
		assertThat(child.getName()).isEqualTo("items");
	}

	@Test
	void should_set_and_get_property() {
		Child child = new Child("items");
		child.setProperty("children");
		assertThat(child.getProperty()).isEqualTo("children");
	}

	@Test
	void should_set_and_get_rule() {
		Child child = new Child("items");
		Rule rule = new Rule("itemRule");
		child.setRule(rule);
		assertThat(child.getRule()).isEqualTo(rule);
	}

	@Test
	void should_have_empty_concrete_rules_by_default() {
		Child child = new Child("items");
		assertThat(child.getConcreteRules()).isEmpty();
	}

	@Test
	void should_have_default_fixed_false() {
		Child child = new Child("items");
		assertThat(child.isFixed()).isFalse();
	}

	@Test
	void should_set_and_get_fixed() {
		Child child = new Child("items");
		child.setFixed(true);
		assertThat(child.isFixed()).isTrue();
	}

	@Test
	void should_have_default_aggregated_false() {
		Child child = new Child("items");
		assertThat(child.isAggregated()).isFalse();
	}

	@Test
	void should_set_and_get_aggregated() {
		Child child = new Child("items");
		child.setAggregated(true);
		assertThat(child.isAggregated()).isTrue();
	}

	@Test
	void should_have_default_client_types_zero() {
		Child child = new Child("items");
		assertThat(child.getClientTypes()).isEqualTo(0);
	}

	@Test
	void should_set_and_get_client_types() {
		Child child = new Child("items");
		child.setClientTypes(5);
		assertThat(child.getClientTypes()).isEqualTo(5);
	}

	@Test
	void should_have_default_deprecated_false() {
		Child child = new Child("items");
		assertThat(child.isDeprecated()).isFalse();
	}

	@Test
	void should_set_and_get_deprecated() {
		Child child = new Child("items");
		child.setDeprecated(true);
		assertThat(child.isDeprecated()).isTrue();
	}

	@Test
	void should_set_and_get_reserve() {
		Child child = new Child("items");
		child.setReserve("some-reserve");
		assertThat(child.getReserve()).isEqualTo("some-reserve");
	}

	@Test
	void should_set_and_get_user_data() {
		Child child = new Child("items");
		Object data = "user-data";
		child.setUserData(data);
		assertThat(child.getUserData()).isEqualTo("user-data");
	}

	@Test
	void should_add_concrete_rules() {
		Child child = new Child("items");
		Rule rule1 = new Rule("rule1");
		rule1.setSortFactor(1);
		Rule rule2 = new Rule("rule2");
		rule2.setSortFactor(2);
		child.getConcreteRules().add(rule1);
		child.getConcreteRules().add(rule2);
		assertThat(child.getConcreteRules()).hasSize(2);
	}
}
