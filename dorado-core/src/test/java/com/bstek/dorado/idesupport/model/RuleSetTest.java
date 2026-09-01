package com.bstek.dorado.idesupport.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.core.pkgs.PackageInfo;

class RuleSetTest {

	@Test
	void should_set_and_get_version() {
		RuleSet ruleSet = new RuleSet();
		ruleSet.setVersion("1.0");
		assertThat(ruleSet.getVersion()).isEqualTo("1.0");
	}

	@Test
	void should_have_empty_package_infos_by_default() {
		RuleSet ruleSet = new RuleSet();
		assertThat(ruleSet.getPackageInfos()).isEmpty();
	}

	@Test
	void should_add_package_info() {
		RuleSet ruleSet = new RuleSet();
		PackageInfo info = new PackageInfo("testPackage");
		ruleSet.getPackageInfos().add(info);
		assertThat(ruleSet.getPackageInfos()).hasSize(1);
	}

	@Test
	void should_add_and_get_rule() {
		RuleSet ruleSet = new RuleSet();
		Rule rule = new Rule("testRule");
		ruleSet.addRule(rule);
		assertThat(ruleSet.getRule("testRule")).isEqualTo(rule);
	}

	@Test
	void should_return_null_for_non_existent_rule() {
		RuleSet ruleSet = new RuleSet();
		assertThat(ruleSet.getRule("nonExistent")).isNull();
	}

	@Test
	void should_have_empty_rule_map_by_default() {
		RuleSet ruleSet = new RuleSet();
		assertThat(ruleSet.getRuleMap()).isEmpty();
	}

	@Test
	void should_add_multiple_rules() {
		RuleSet ruleSet = new RuleSet();
		ruleSet.addRule(new Rule("rule1"));
		ruleSet.addRule(new Rule("rule2"));
		assertThat(ruleSet.getRuleMap()).hasSize(2);
	}

	@Test
	void should_throw_when_adding_rule_with_empty_name() {
		RuleSet ruleSet = new RuleSet();
		Rule rule = new Rule("");
		assertThatThrownBy(() -> ruleSet.addRule(rule)).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void should_overwrite_rule_with_same_name() {
		RuleSet ruleSet = new RuleSet();
		Rule rule1 = new Rule("testRule");
		rule1.setLabel("Label1");
		Rule rule2 = new Rule("testRule");
		rule2.setLabel("Label2");
		ruleSet.addRule(rule1);
		ruleSet.addRule(rule2);
		assertThat(ruleSet.getRule("testRule").getLabel()).isEqualTo("Label2");
	}
}
