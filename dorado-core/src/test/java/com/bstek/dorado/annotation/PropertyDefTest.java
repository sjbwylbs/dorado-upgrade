package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

class PropertyDefTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = PropertyDef.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_method_and_field_when_inspected() {
		Target target = PropertyDef.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactlyInAnyOrder(ElementType.METHOD, ElementType.FIELD);
	}

	@Test
	void should_be_inherited_when_inspected() {
		Inherited inherited = PropertyDef.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNotNull();
	}

	@Test
	void should_have_empty_string_as_default_label() throws Exception {
		Method method = PropertyDef.class.getDeclaredMethod("label");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_empty_string_as_default_description() throws Exception {
		Method method = PropertyDef.class.getDeclaredMethod("description");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_false_as_default_required() throws Exception {
		Method method = PropertyDef.class.getDeclaredMethod("required");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}
}
