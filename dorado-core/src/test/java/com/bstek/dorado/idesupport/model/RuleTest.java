package com.bstek.dorado.idesupport.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;

import org.junit.jupiter.api.Test;

class RuleTest {

	@Test
	void should_set_name_via_constructor() {
		Rule rule = new Rule("testRule");
		assertThat(rule.getName()).isEqualTo("testRule");
	}

	@Test
	void should_have_default_global_true() {
		Rule rule = new Rule("testRule");
		assertThat(rule.isGlobal()).isTrue();
	}

	@Test
	void should_set_and_get_label() {
		Rule rule = new Rule("testRule");
		rule.setLabel("Test Rule");
		assertThat(rule.getLabel()).isEqualTo("Test Rule");
	}

	@Test
	void should_set_and_get_node_name() {
		Rule rule = new Rule("testRule");
		rule.setNodeName("TestNode");
		assertThat(rule.getNodeName()).isEqualTo("TestNode");
	}

	@Test
	void should_set_and_get_type() {
		Rule rule = new Rule("testRule");
		rule.setType("com.example.TestType");
		assertThat(rule.getType()).isEqualTo("com.example.TestType");
	}

	@Test
	void should_set_and_get_category() {
		Rule rule = new Rule("testRule");
		rule.setCategory("ui");
		assertThat(rule.getCategory()).isEqualTo("ui");
	}

	@Test
	void should_set_and_get_robots() {
		Rule rule = new Rule("testRule");
		String[] robots = {"robot1", "robot2"};
		rule.setRobots(robots);
		assertThat(rule.getRobots()).containsExactly("robot1", "robot2");
	}

	@Test
	void should_set_and_get_sort_factor() {
		Rule rule = new Rule("testRule");
		rule.setSortFactor(10);
		assertThat(rule.getSortFactor()).isEqualTo(10);
	}

	@Test
	void should_set_and_get_icon() {
		Rule rule = new Rule("testRule");
		rule.setIcon("/icons/test.png");
		assertThat(rule.getIcon()).isEqualTo("/icons/test.png");
	}

	@Test
	void should_have_default_label_property() {
		Rule rule = new Rule("testRule");
		assertThat(rule.getLabelProperty()).isEqualTo("name,id");
	}

	@Test
	void should_set_and_get_label_property() {
		Rule rule = new Rule("testRule");
		rule.setLabelProperty("title");
		assertThat(rule.getLabelProperty()).isEqualTo("title");
	}

	@Test
	void should_set_and_get_auto_generate_id() {
		Rule rule = new Rule("testRule");
		rule.setAutoGenerateId(true);
		assertThat(rule.isAutoGenerateId()).isTrue();
	}

	@Test
	void should_have_default_visible_true() {
		Rule rule = new Rule("testRule");
		assertThat(rule.isVisible()).isTrue();
	}

	@Test
	void should_set_and_get_abstract() {
		Rule rule = new Rule("testRule");
		rule.setAbstract(true);
		assertThat(rule.isAbstract()).isTrue();
	}

	@Test
	void should_add_and_get_property() {
		Rule rule = new Rule("testRule");
		Property prop = new Property("color");
		rule.addProperty(prop);
		assertThat(rule.getProperty("color")).isEqualTo(prop);
	}

	@Test
	void should_add_properties_collection() {
		Rule rule = new Rule("testRule");
		Property prop1 = new Property("color");
		Property prop2 = new Property("size");
		rule.addProperties(Arrays.asList(prop1, prop2));
		assertThat(rule.getProperties()).hasSize(2);
	}

	@Test
	void should_add_and_get_primitive_property() {
		Rule rule = new Rule("testRule");
		Property prop = new Property("id");
		rule.addPrimitiveProperty(prop);
		assertThat(rule.getPrimitiveProperty("id")).isEqualTo(prop);
	}

	@Test
	void should_add_primitive_properties_collection() {
		Rule rule = new Rule("testRule");
		Property prop1 = new Property("id");
		Property prop2 = new Property("name");
		rule.addPrimitiveProperties(Arrays.asList(prop1, prop2));
		assertThat(rule.getPrimitiveProperties()).hasSize(2);
	}

	@Test
	void should_add_and_get_client_event() {
		Rule rule = new Rule("testRule");
		ClientEvent event = new ClientEvent();
		event.setName("onClick");
		rule.addClientEvent(event);
		assertThat(rule.getClientEvent("onClick")).isEqualTo(event);
	}

	@Test
	void should_add_client_events_collection() {
		Rule rule = new Rule("testRule");
		ClientEvent event1 = new ClientEvent();
		event1.setName("onClick");
		ClientEvent event2 = new ClientEvent();
		event2.setName("onLoad");
		rule.addClientEvents(Arrays.asList(event1, event2));
		assertThat(rule.getClientEvents()).hasSize(2);
	}

	@Test
	void should_add_and_get_child() {
		Rule rule = new Rule("testRule");
		Child child = new Child("items");
		Rule childRule = new Rule("childRule");
		child.setRule(childRule);
		rule.addChild(child);
		assertThat(rule.getChild("items")).isEqualTo(child);
	}

	@Test
	void should_set_parents_and_register_sub_rules() {
		Rule parent = new Rule("parent");
		Rule child = new Rule("child");
		child.setParents(new Rule[] {parent});
		assertThat(child.getParents()).containsExactly(parent);
		assertThat(parent.getSubRules()).containsExactly(child);
	}

	@Test
	void should_remove_from_old_parent_sub_rules_when_setting_new_parents() {
		Rule parent1 = new Rule("parent1");
		Rule parent2 = new Rule("parent2");
		Rule child = new Rule("child");
		child.setParents(new Rule[] {parent1});
		assertThat(parent1.getSubRules()).containsExactly(child);

		child.setParents(new Rule[] {parent2});
		assertThat(parent1.getSubRules()).isEmpty();
		assertThat(parent2.getSubRules()).containsExactly(child);
	}

	@Test
	void should_return_empty_array_when_no_sub_rules() {
		Rule rule = new Rule("testRule");
		assertThat(rule.getSubRules()).isEmpty();
	}

	@Test
	void should_check_is_sub_rule_of_direct_parent() {
		Rule parent = new Rule("parent");
		Rule child = new Rule("child");
		child.setParents(new Rule[] {parent});
		assertThat(child.isSubRuleOf(parent)).isTrue();
	}

	@Test
	void should_check_is_sub_rule_of_grandparent() {
		Rule grandparent = new Rule("grandparent");
		Rule parent = new Rule("parent");
		Rule child = new Rule("child");
		parent.setParents(new Rule[] {grandparent});
		child.setParents(new Rule[] {parent});
		assertThat(child.isSubRuleOf(grandparent)).isTrue();
	}

	@Test
	void should_return_false_for_is_sub_rule_of_unrelated() {
		Rule rule1 = new Rule("rule1");
		Rule rule2 = new Rule("rule2");
		assertThat(rule1.isSubRuleOf(rule2)).isFalse();
	}

	@Test
	void should_set_and_get_deprecated() {
		Rule rule = new Rule("testRule");
		rule.setDeprecated(true);
		assertThat(rule.isDeprecated()).isTrue();
	}

	@Test
	void should_set_and_get_reserve() {
		Rule rule = new Rule("testRule");
		rule.setReserve("reserve-data");
		assertThat(rule.getReserve()).isEqualTo("reserve-data");
	}

	@Test
	void should_set_and_get_user_data() {
		Rule rule = new Rule("testRule");
		Object userData = "custom-data";
		rule.setUserData(userData);
		assertThat(rule.getUserData()).isEqualTo("custom-data");
	}

	@Test
	void should_set_and_get_client_types() {
		Rule rule = new Rule("testRule");
		rule.setClientTypes(7);
		assertThat(rule.getClientTypes()).isEqualTo(7);
	}
}
