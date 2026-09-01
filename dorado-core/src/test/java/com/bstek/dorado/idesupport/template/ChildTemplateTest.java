package com.bstek.dorado.idesupport.template;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class ChildTemplateTest {

	@Test
	void should_set_name_via_constructor() {
		ChildTemplate ct = new ChildTemplate("items");
		assertThat(ct.getName()).isEqualTo("items");
	}

	@Test
	void should_throw_when_name_is_empty() {
		assertThatThrownBy(() -> new ChildTemplate("")).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void should_create_with_name_and_rule_template() {
		RuleTemplate rt = new RuleTemplate("rule");
		ChildTemplate ct = new ChildTemplate("items", rt);
		assertThat(ct.getName()).isEqualTo("items");
		assertThat(ct.getRuleTemplate()).isEqualTo(rt);
	}

	@Test
	void should_set_and_get_property() {
		ChildTemplate ct = new ChildTemplate("items");
		ct.setProperty("children");
		assertThat(ct.getProperty()).isEqualTo("children");
	}

	@Test
	void should_set_and_get_rule_template() {
		ChildTemplate ct = new ChildTemplate("items");
		RuleTemplate rt = new RuleTemplate("rule");
		ct.setRuleTemplate(rt);
		assertThat(ct.getRuleTemplate()).isEqualTo(rt);
	}

	@Test
	void should_have_default_fixed_false() {
		ChildTemplate ct = new ChildTemplate("items");
		assertThat(ct.isFixed()).isFalse();
	}

	@Test
	void should_set_and_get_fixed() {
		ChildTemplate ct = new ChildTemplate("items");
		ct.setFixed(true);
		assertThat(ct.isFixed()).isTrue();
	}

	@Test
	void should_have_default_aggregated_false() {
		ChildTemplate ct = new ChildTemplate("items");
		assertThat(ct.isAggregated()).isFalse();
	}

	@Test
	void should_set_and_get_aggregated() {
		ChildTemplate ct = new ChildTemplate("items");
		ct.setAggregated(true);
		assertThat(ct.isAggregated()).isTrue();
	}

	@Test
	void should_have_default_deprecated_false() {
		ChildTemplate ct = new ChildTemplate("items");
		assertThat(ct.isDeprecated()).isFalse();
	}

	@Test
	void should_set_and_get_deprecated() {
		ChildTemplate ct = new ChildTemplate("items");
		ct.setDeprecated(true);
		assertThat(ct.isDeprecated()).isTrue();
	}

	@Test
	void should_have_default_visible_true() {
		ChildTemplate ct = new ChildTemplate("items");
		assertThat(ct.isVisible()).isTrue();
	}

	@Test
	void should_set_and_get_visible() {
		ChildTemplate ct = new ChildTemplate("items");
		ct.setVisible(false);
		assertThat(ct.isVisible()).isFalse();
	}

	@Test
	void should_have_default_public_true() {
		ChildTemplate ct = new ChildTemplate("items");
		assertThat(ct.isPublic()).isTrue();
	}

	@Test
	void should_set_and_get_public() {
		ChildTemplate ct = new ChildTemplate("items");
		ct.setPublic(false);
		assertThat(ct.isPublic()).isFalse();
	}

	@Test
	void should_set_and_get_client_types() {
		ChildTemplate ct = new ChildTemplate("items");
		ct.setClientTypes(4);
		assertThat(ct.getClientTypes()).isEqualTo(4);
	}

	@Test
	void should_set_and_get_reserve() {
		ChildTemplate ct = new ChildTemplate("items");
		ct.setReserve("reserve-data");
		assertThat(ct.getReserve()).isEqualTo("reserve-data");
	}
}
