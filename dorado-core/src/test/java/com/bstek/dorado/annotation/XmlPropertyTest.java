package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

class XmlPropertyTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = XmlProperty.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_method_when_inspected() {
		Target target = XmlProperty.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactly(ElementType.METHOD);
	}

	@Test
	void should_be_inherited_when_inspected() {
		Inherited inherited = XmlProperty.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNotNull();
	}

	@Test
	void should_have_empty_string_as_default_propertyName() throws Exception {
		Method method = XmlProperty.class.getDeclaredMethod("propertyName");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_empty_string_as_default_propertyType() throws Exception {
		Method method = XmlProperty.class.getDeclaredMethod("propertyType");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_false_as_default_ignored() throws Exception {
		Method method = XmlProperty.class.getDeclaredMethod("ignored");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_empty_array_as_default_clientTypes() throws Exception {
		Method method = XmlProperty.class.getDeclaredMethod("clientTypes");
		assertThat(method.getDefaultValue()).isEqualTo(new int[] {});
	}

	@Test
	void should_have_false_as_default_deprecated() throws Exception {
		Method method = XmlProperty.class.getDeclaredMethod("deprecated");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_false_as_default_unsupported() throws Exception {
		Method method = XmlProperty.class.getDeclaredMethod("unsupported");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_false_as_default_attributeOnly() throws Exception {
		Method method = XmlProperty.class.getDeclaredMethod("attributeOnly");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_dyna_as_default_expressionMode() throws Exception {
		Method method = XmlProperty.class.getDeclaredMethod("expressionMode");
		assertThat(method.getDefaultValue()).isEqualTo(ExpressionMode.DYNA);
	}

	@Test
	void should_have_empty_string_as_default_parser() throws Exception {
		Method method = XmlProperty.class.getDeclaredMethod("parser");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_false_as_default_composite() throws Exception {
		Method method = XmlProperty.class.getDeclaredMethod("composite");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}
}
