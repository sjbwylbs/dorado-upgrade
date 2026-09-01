package com.bstek.dorado.idesupport.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;

import org.junit.jupiter.api.Test;

class PropertyTest {

	@Test
	void should_create_with_no_arg_constructor() {
		Property prop = new Property();
		assertThat(prop.getName()).isNull();
	}

	@Test
	void should_create_with_name_constructor() {
		Property prop = new Property("color");
		assertThat(prop.getName()).isEqualTo("color");
	}

	@Test
	void should_set_and_get_name() {
		Property prop = new Property();
		prop.setName("size");
		assertThat(prop.getName()).isEqualTo("size");
	}

	@Test
	void should_set_and_get_type() {
		Property prop = new Property("color");
		prop.setType("java.lang.String");
		assertThat(prop.getType()).isEqualTo("java.lang.String");
	}

	@Test
	void should_set_and_get_default_value() {
		Property prop = new Property("color");
		prop.setDefaultValue("red");
		assertThat(prop.getDefaultValue()).isEqualTo("red");
	}

	@Test
	void should_set_and_get_highlight() {
		Property prop = new Property("color");
		prop.setHighlight(1);
		assertThat(prop.getHighlight()).isEqualTo(1);
	}

	@Test
	void should_have_default_fixed_false() {
		Property prop = new Property("color");
		assertThat(prop.isFixed()).isFalse();
	}

	@Test
	void should_set_and_get_fixed() {
		Property prop = new Property("color");
		prop.setFixed(true);
		assertThat(prop.isFixed()).isTrue();
	}

	@Test
	void should_set_and_get_enum_values() {
		Property prop = new Property("color");
		String[] values = {"red", "green", "blue"};
		prop.setEnumValues(values);
		assertThat(prop.getEnumValues()).containsExactly("red", "green", "blue");
	}

	@Test
	void should_set_and_get_editor() {
		Property prop = new Property("color");
		prop.setEditor("color-picker");
		assertThat(prop.getEditor()).isEqualTo("color-picker");
	}

	@Test
	void should_have_default_visible_true() {
		Property prop = new Property("color");
		assertThat(prop.isVisible()).isTrue();
	}

	@Test
	void should_set_and_get_visible() {
		Property prop = new Property("color");
		prop.setVisible(false);
		assertThat(prop.isVisible()).isFalse();
	}

	@Test
	void should_have_default_composite_type_unsupport() {
		Property prop = new Property("color");
		assertThat(prop.getCompositeType()).isEqualTo(CompositeType.Unsupport);
	}

	@Test
	void should_set_and_get_composite_type() {
		Property prop = new Property("color");
		prop.setCompositeType(CompositeType.Fixed);
		assertThat(prop.getCompositeType()).isEqualTo(CompositeType.Fixed);
	}

	@Test
	void should_set_and_get_reference() {
		Property prop = new Property("color");
		Rule rule = new Rule("colorRule");
		Reference ref = new Reference(rule, "name");
		prop.setReference(ref);
		assertThat(prop.getReference()).isEqualTo(ref);
	}

	@Test
	void should_lazily_initialize_properties_map() {
		Property prop = new Property("parent");
		assertThat(prop.getProperties()).isEmpty();
	}

	@Test
	void should_add_sub_property() {
		Property parent = new Property("parent");
		Property child = new Property("child");
		parent.addProperty(child);
		assertThat(parent.getProperty("child")).isEqualTo(child);
	}

	@Test
	void should_add_properties_collection() {
		Property parent = new Property("parent");
		Property child1 = new Property("child1");
		Property child2 = new Property("child2");
		parent.addProperties(Arrays.asList(child1, child2));
		assertThat(parent.getProperties()).hasSize(2);
		assertThat(child1.getParentProperty()).isEqualTo(parent);
		assertThat(child2.getParentProperty()).isEqualTo(parent);
	}

	@Test
	void should_set_and_get_parent_property() {
		Property parent = new Property("parent");
		Property child = new Property("child");
		child.setParentProperty(parent);
		assertThat(child.getParentProperty()).isEqualTo(parent);
	}

	@Test
	void should_have_default_deprecated_false() {
		Property prop = new Property("color");
		assertThat(prop.isDeprecated()).isFalse();
	}

	@Test
	void should_set_and_get_deprecated() {
		Property prop = new Property("color");
		prop.setDeprecated(true);
		assertThat(prop.isDeprecated()).isTrue();
	}

	@Test
	void should_set_and_get_reserve() {
		Property prop = new Property("color");
		prop.setReserve("reserve-data");
		assertThat(prop.getReserve()).isEqualTo("reserve-data");
	}

	@Test
	void should_set_and_get_user_data() {
		Property prop = new Property("color");
		Object userData = new Object();
		prop.setUserData(userData);
		assertThat(prop.getUserData()).isSameAs(userData);
	}

	@Test
	void should_set_and_get_client_types() {
		Property prop = new Property("color");
		prop.setClientTypes(2);
		assertThat(prop.getClientTypes()).isEqualTo(2);
	}
}
