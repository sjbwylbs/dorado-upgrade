package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

class XmlNodeTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = XmlNode.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_type_when_inspected() {
		Target target = XmlNode.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactly(ElementType.TYPE);
	}

	@Test
	void should_be_inherited_when_inspected() {
		Inherited inherited = XmlNode.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNotNull();
	}

	@Test
	void should_have_empty_string_as_default_nodeName() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("nodeName");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_empty_string_as_default_label() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("label");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_empty_string_as_default_icon() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("icon");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_single_empty_string_as_default_implTypes() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("implTypes");
		assertThat(method.getDefaultValue()).isEqualTo(new String[] { "" });
	}

	@Test
	void should_have_empty_string_as_default_definitionType() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("definitionType");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_false_as_default_scopable() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("scopable");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_false_as_default_inheritable() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("inheritable");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_true_as_default_isPublic() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("isPublic");
		assertThat(method.getDefaultValue()).isEqualTo(true);
	}

	@Test
	void should_have_empty_array_as_default_clientTypes() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("clientTypes");
		assertThat(method.getDefaultValue()).isEqualTo(new int[] {});
	}

	@Test
	void should_have_false_as_default_deprecated() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("deprecated");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_empty_string_as_default_parser() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("parser");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_empty_string_as_default_fixedProperties() throws Exception {
		Method method = XmlNode.class.getDeclaredMethod("fixedProperties");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}
}
