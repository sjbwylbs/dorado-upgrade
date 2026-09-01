package com.bstek.dorado.idesupport.parse;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bstek.dorado.idesupport.RuleTemplateManager;
import com.bstek.dorado.idesupport.template.RuleTemplate;

class ConfigRuleParseContextTest {

	private ConfigRuleParseContext context;

	@BeforeEach
	void setUp() {
		context = new ConfigRuleParseContext();
	}

	@Test
	void should_have_empty_rule_element_map_by_default() {
		assertThat(context.getRuleElementMap()).isEmpty();
	}

	@Test
	void should_have_empty_rule_template_map_by_default() {
		assertThat(context.getRuleTemplateMap()).isEmpty();
	}

	@Test
	void should_have_null_rule_template_manager_by_default() {
		assertThat(context.getRuleTemplateManager()).isNull();
	}

	@Test
	void should_set_and_get_rule_template_manager() {
		RuleTemplateManager manager = new RuleTemplateManager();
		context.setRuleTemplateManager(manager);
		assertThat(context.getRuleTemplateManager()).isSameAs(manager);
	}

	@Test
	void should_add_to_rule_element_map() {
		assertThat(context.getRuleElementMap()).isEmpty();
		// The map is mutable and can be populated externally
		context.getRuleElementMap().put("testRule", null);
		assertThat(context.getRuleElementMap()).hasSize(1);
	}

	@Test
	void should_add_to_rule_template_map() {
		RuleTemplate rt = new RuleTemplate("testRule");
		context.getRuleTemplateMap().put("testRule", rt);
		assertThat(context.getRuleTemplateMap()).hasSize(1);
		assertThat(context.getRuleTemplateMap().get("testRule")).isEqualTo(rt);
	}

	@Test
	void should_maintain_insertion_order_in_rule_element_map() {
		context.getRuleElementMap().put("rule1", null);
		context.getRuleElementMap().put("rule2", null);
		context.getRuleElementMap().put("rule3", null);
		assertThat(context.getRuleElementMap()).containsKeys("rule1", "rule2", "rule3");
		assertThat(context.getRuleElementMap()).hasSize(3);
	}

	@Test
	void should_maintain_insertion_order_in_rule_template_map() {
		RuleTemplate rt1 = new RuleTemplate("rule1");
		RuleTemplate rt2 = new RuleTemplate("rule2");
		context.getRuleTemplateMap().put("rule1", rt1);
		context.getRuleTemplateMap().put("rule2", rt2);
		assertThat(context.getRuleTemplateMap()).containsKeys("rule1", "rule2");
	}
}
