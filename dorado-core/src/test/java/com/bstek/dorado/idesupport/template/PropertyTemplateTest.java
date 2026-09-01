package com.bstek.dorado.idesupport.template;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;

import org.junit.jupiter.api.Test;

class PropertyTemplateTest {

	@Test
	void should_create_with_no_arg_constructor() {
		PropertyTemplate pt = new PropertyTemplate();
		assertThat(pt.getName()).isNull();
	}

	@Test
	void should_create_with_name_constructor() {
		PropertyTemplate pt = new PropertyTemplate("color");
		assertThat(pt.getName()).isEqualTo("color");
	}

	@Test
	void should_set_and_get_name() {
		PropertyTemplate pt = new PropertyTemplate();
		pt.setName("size");
		assertThat(pt.getName()).isEqualTo("size");
	}

	@Test
	void should_set_and_get_type() {
		PropertyTemplate pt = new PropertyTemplate("color");
		pt.setType("java.lang.String");
		assertThat(pt.getType()).isEqualTo("java.lang.String");
	}

	@Test
	void should_set_and_get_default_value() {
		PropertyTemplate pt = new PropertyTemplate("color");
		pt.setDefaultValue("red");
		assertThat(pt.getDefaultValue()).isEqualTo("red");
	}

	@Test
	void should_set_and_get_fixed() {
		PropertyTemplate pt = new PropertyTemplate("color");
		pt.setFixed(true);
		assertThat(pt.getFixed()).isTrue();
	}

	@Test
	void should_set_and_get_enum_values() {
		PropertyTemplate pt = new PropertyTemplate("color");
		String[] values = {"red", "green", "blue"};
		pt.setEnumValues(values);
		assertThat(pt.getEnumValues()).containsExactly("red", "green", "blue");
	}

	@Test
	void should_set_and_get_editor() {
		PropertyTemplate pt = new PropertyTemplate("color");
		pt.setEditor("color-picker");
		assertThat(pt.getEditor()).isEqualTo("color-picker");
	}

	@Test
	void should_set_and_get_highlight() {
		PropertyTemplate pt = new PropertyTemplate("color");
		pt.setHighlight(2);
		assertThat(pt.getHighlight()).isEqualTo(2);
	}

	@Test
	void should_have_default_visible_true() {
		PropertyTemplate pt = new PropertyTemplate("color");
		assertThat(pt.isVisible()).isTrue();
	}

	@Test
	void should_set_and_get_visible() {
		PropertyTemplate pt = new PropertyTemplate("color");
		pt.setVisible(false);
		assertThat(pt.isVisible()).isFalse();
	}

	@Test
	void should_set_and_get_reference() {
		PropertyTemplate pt = new PropertyTemplate("color");
		ReferenceTemplate ref = new ReferenceTemplate("prop") {
			@Override
			public RuleTemplate getRuleTemplate() {
				return null;
			}
		};
		pt.setReference(ref);
		assertThat(pt.getReference()).isEqualTo(ref);
	}

	@Test
	void should_lazily_initialize_properties_map() {
		PropertyTemplate pt = new PropertyTemplate("parent");
		assertThat(pt.getProperties()).isEmpty();
	}

	@Test
	void should_add_sub_property() {
		PropertyTemplate parent = new PropertyTemplate("parent");
		PropertyTemplate child = new PropertyTemplate("child");
		parent.addProperty(child);
		assertThat(parent.getProperty("child")).isEqualTo(child);
	}

	@Test
	void should_add_properties_collection() {
		PropertyTemplate parent = new PropertyTemplate("parent");
		PropertyTemplate child1 = new PropertyTemplate("child1");
		PropertyTemplate child2 = new PropertyTemplate("child2");
		parent.addProperties(Arrays.asList(child1, child2));
		assertThat(parent.getProperties()).hasSize(2);
	}

	@Test
	void should_set_and_get_deprecated() {
		PropertyTemplate pt = new PropertyTemplate("color");
		pt.setDeprecated(true);
		assertThat(pt.isDeprecated()).isTrue();
	}

	@Test
	void should_set_and_get_reserve() {
		PropertyTemplate pt = new PropertyTemplate("color");
		pt.setReserve("reserve-data");
		assertThat(pt.getReserve()).isEqualTo("reserve-data");
	}

	@Test
	void should_set_and_get_client_types() {
		PropertyTemplate pt = new PropertyTemplate("color");
		pt.setClientTypes(3);
		assertThat(pt.getClientTypes()).isEqualTo(3);
	}
}
