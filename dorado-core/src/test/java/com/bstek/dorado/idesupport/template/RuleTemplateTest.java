package com.bstek.dorado.idesupport.template;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.idesupport.model.ClientEvent;

class RuleTemplateTest {

	@Test
	void should_set_name_via_single_arg_constructor() {
		RuleTemplate rt = new RuleTemplate("testRule");
		assertThat(rt.getName()).isEqualTo("testRule");
		assertThat(rt.getType()).isNull();
	}

	@Test
	void should_set_name_and_type_via_two_arg_constructor() {
		RuleTemplate rt = new RuleTemplate("testRule", "com.example.Type");
		assertThat(rt.getName()).isEqualTo("testRule");
		assertThat(rt.getType()).isEqualTo("com.example.Type");
	}

	@Test
	void should_set_and_get_label() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setLabel("Test Rule");
		assertThat(rt.getLabel()).isEqualTo("Test Rule");
	}

	@Test
	void should_set_and_get_node_name() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setNodeName("TestNode");
		assertThat(rt.getNodeName()).isEqualTo("TestNode");
	}

	@Test
	void should_set_and_get_category() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setCategory("ui");
		assertThat(rt.getCategory()).isEqualTo("ui");
	}

	@Test
	void should_set_and_get_robots() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setRobots(new String[] {"robot1"});
		assertThat(rt.getRobots()).containsExactly("robot1");
	}

	@Test
	void should_set_and_get_sort_factor() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setSortFactor(5);
		assertThat(rt.getSortFactor()).isEqualTo(5);
	}

	@Test
	void should_set_and_get_scope() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setScope("public");
		assertThat(rt.getScope()).isEqualTo("public");
	}

	@Test
	void should_set_and_get_icon() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setIcon("/icons/test.png");
		assertThat(rt.getIcon()).isEqualTo("/icons/test.png");
	}

	@Test
	void should_set_and_get_label_property() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setLabelProperty("title");
		assertThat(rt.getLabelProperty()).isEqualTo("title");
	}

	@Test
	void should_set_and_get_auto_generate_id() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setAutoGenerateId(true);
		assertThat(rt.isAutoGenerateId()).isTrue();
	}

	@Test
	void should_set_and_get_client_types() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setClientTypes(3);
		assertThat(rt.getClientTypes()).isEqualTo(3);
	}

	@Test
	void should_set_and_get_deprecated() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setDeprecated(true);
		assertThat(rt.isDeprecated()).isTrue();
	}

	@Test
	void should_set_and_get_visible() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setVisible(false);
		assertThat(rt.isVisible()).isFalse();
	}

	@Test
	void should_have_default_visible_true() {
		RuleTemplate rt = new RuleTemplate("testRule");
		assertThat(rt.isVisible()).isTrue();
	}

	@Test
	void should_set_and_get_abstract() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setAbstract(true);
		assertThat(rt.isAbstract()).isTrue();
	}

	@Test
	void should_set_and_get_global() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setGlobal(true);
		assertThat(rt.isGlobal()).isTrue();
	}

	@Test
	void should_set_and_get_auto_initialize() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setAutoInitialize(false);
		assertThat(rt.isAutoInitialize()).isFalse();
	}

	@Test
	void should_have_default_auto_initialize_true() {
		RuleTemplate rt = new RuleTemplate("testRule");
		assertThat(rt.isAutoInitialize()).isTrue();
	}

	@Test
	void should_set_and_get_initialized() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setInitialized(true);
		assertThat(rt.isInitialized()).isTrue();
	}

	@Test
	void should_add_and_get_property() {
		RuleTemplate rt = new RuleTemplate("testRule");
		PropertyTemplate pt = new PropertyTemplate("color");
		rt.addProperty(pt);
		assertThat(rt.getProperty("color")).isEqualTo(pt);
	}

	@Test
	void should_add_properties_collection() {
		RuleTemplate rt = new RuleTemplate("testRule");
		PropertyTemplate pt1 = new PropertyTemplate("color");
		PropertyTemplate pt2 = new PropertyTemplate("size");
		rt.addProperties(Arrays.asList(pt1, pt2));
		assertThat(rt.getProperties()).hasSize(2);
	}

	@Test
	void should_add_and_get_primitive_property() {
		RuleTemplate rt = new RuleTemplate("testRule");
		PropertyTemplate pt = new PropertyTemplate("id");
		rt.addPrimitiveProperty(pt);
		assertThat(rt.getPrimitiveProperty("id")).isEqualTo(pt);
	}

	@Test
	void should_add_primitive_properties_collection() {
		RuleTemplate rt = new RuleTemplate("testRule");
		PropertyTemplate pt1 = new PropertyTemplate("id");
		PropertyTemplate pt2 = new PropertyTemplate("name");
		rt.addPrimitiveProperties(Arrays.asList(pt1, pt2));
		assertThat(rt.getPrimitiveProperties()).hasSize(2);
	}

	@Test
	void should_add_and_get_client_event() {
		RuleTemplate rt = new RuleTemplate("testRule");
		ClientEvent event = new ClientEvent();
		event.setName("onClick");
		rt.addClientEvent(event);
		assertThat(rt.getClientEvent("onClick")).isEqualTo(event);
	}

	@Test
	void should_add_client_events_collection() {
		RuleTemplate rt = new RuleTemplate("testRule");
		ClientEvent e1 = new ClientEvent();
		e1.setName("onClick");
		ClientEvent e2 = new ClientEvent();
		e2.setName("onLoad");
		rt.addClientEvents(Arrays.asList(e1, e2));
		assertThat(rt.getClientEvents()).hasSize(2);
	}

	@Test
	void should_add_and_get_child() {
		RuleTemplate rt = new RuleTemplate("testRule");
		ChildTemplate ct = new ChildTemplate("items");
		rt.addChild(ct);
		assertThat(rt.getChild("items")).isEqualTo(ct);
	}

	@Test
	void should_add_children_collection() {
		RuleTemplate rt = new RuleTemplate("testRule");
		ChildTemplate ct1 = new ChildTemplate("items");
		ChildTemplate ct2 = new ChildTemplate("headers");
		rt.addChildren(Arrays.asList(ct1, ct2));
		assertThat(rt.getChildren()).hasSize(2);
	}

	@Test
	void should_set_parents_and_register_sub_templates() {
		RuleTemplate parent = new RuleTemplate("parent");
		RuleTemplate child = new RuleTemplate("child");
		child.setParents(new RuleTemplate[] {parent});
		assertThat(child.getParents()).containsExactly(parent);
		assertThat(parent.getSubRuleTemplates()).containsExactly(child);
	}

	@Test
	void should_remove_from_old_parent_when_setting_new_parents() {
		RuleTemplate parent1 = new RuleTemplate("parent1");
		RuleTemplate parent2 = new RuleTemplate("parent2");
		RuleTemplate child = new RuleTemplate("child");
		child.setParents(new RuleTemplate[] {parent1});
		assertThat(parent1.getSubRuleTemplates()).containsExactly(child);

		child.setParents(new RuleTemplate[] {parent2});
		assertThat(parent1.getSubRuleTemplates()).isEmpty();
		assertThat(parent2.getSubRuleTemplates()).containsExactly(child);
	}

	@Test
	void should_return_empty_array_when_no_sub_templates() {
		RuleTemplate rt = new RuleTemplate("testRule");
		assertThat(rt.getSubRuleTemplates()).isEmpty();
	}

	@Test
	void should_return_own_properties_when_no_parents() throws Exception {
		RuleTemplate rt = new RuleTemplate("testRule");
		PropertyTemplate pt = new PropertyTemplate("color");
		rt.addProperty(pt);
		assertThat(rt.getFinalProperties()).containsEntry("color", pt);
	}

	@Test
	void should_inherit_parent_properties() throws Exception {
		RuleTemplate parent = new RuleTemplate("parent");
		PropertyTemplate parentProp = new PropertyTemplate("color");
		parent.addProperty(parentProp);

		RuleTemplate child = new RuleTemplate("child");
		child.setParents(new RuleTemplate[] {parent});

		assertThat(child.getFinalProperties()).containsKey("color");
	}

	@Test
	void should_return_own_client_events_when_no_parents() {
		RuleTemplate rt = new RuleTemplate("testRule");
		ClientEvent event = new ClientEvent();
		event.setName("onClick");
		rt.addClientEvent(event);
		assertThat(rt.getFinalClientEvents()).containsEntry("onClick", event);
	}

	@Test
	void should_inherit_parent_client_events() {
		RuleTemplate parent = new RuleTemplate("parent");
		ClientEvent parentEvent = new ClientEvent();
		parentEvent.setName("onClick");
		parent.addClientEvent(parentEvent);

		RuleTemplate child = new RuleTemplate("child");
		child.setParents(new RuleTemplate[] {parent});

		assertThat(child.getFinalClientEvents()).containsKey("onClick");
	}

	@Test
	void should_return_own_children_when_no_parents() {
		RuleTemplate rt = new RuleTemplate("testRule");
		ChildTemplate ct = new ChildTemplate("items");
		rt.addChild(ct);
		assertThat(rt.getFinalChildren()).containsEntry("items", ct);
	}

	@Test
	void should_inherit_public_parent_children() {
		RuleTemplate parent = new RuleTemplate("parent");
		ChildTemplate ct = new ChildTemplate("items");
		ct.setPublic(true);
		parent.addChild(ct);

		RuleTemplate child = new RuleTemplate("child");
		child.setParents(new RuleTemplate[] {parent});

		assertThat(child.getFinalChildren()).containsKey("items");
	}

	@Test
	void should_not_inherit_private_parent_children() {
		RuleTemplate parent = new RuleTemplate("parent");
		ChildTemplate ct = new ChildTemplate("items");
		ct.setPublic(false);
		parent.addChild(ct);

		RuleTemplate child = new RuleTemplate("child");
		child.setParents(new RuleTemplate[] {parent});

		assertThat(child.getFinalChildren()).doesNotContainKey("items");
	}

	@Test
	void should_return_own_primitive_properties_when_no_parents() throws Exception {
		RuleTemplate rt = new RuleTemplate("testRule");
		PropertyTemplate pt = new PropertyTemplate("id");
		rt.addPrimitiveProperty(pt);
		assertThat(rt.getFinalPrimitiveProperties()).containsEntry("id", pt);
	}

	@Test
	void should_process_inheritance_only_once() throws Exception {
		RuleTemplate parent = new RuleTemplate("parent");
		parent.setLabel("ParentLabel");
		RuleTemplate child = new RuleTemplate("child");
		child.setParents(new RuleTemplate[] {parent});

		child.processInheritance();
		assertThat(child.getLabel()).isEqualTo("ParentLabel");

		// Change parent label after inheritance processed
		parent.setLabel("ChangedLabel");
		// Should not change because inheritance is already processed
		child.processInheritance();
		assertThat(child.getLabel()).isEqualTo("ParentLabel");
	}

	@Test
	void should_set_and_get_reserve() {
		RuleTemplate rt = new RuleTemplate("testRule");
		rt.setReserve("reserve-data");
		assertThat(rt.getReserve()).isEqualTo("reserve-data");
	}
}
