package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

class IdePropertyTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = IdeProperty.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_method_when_inspected() {
		Target target = IdeProperty.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactly(ElementType.METHOD);
	}

	@Test
	void should_be_inherited_when_inspected() {
		Inherited inherited = IdeProperty.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNotNull();
	}

	@Test
	void should_have_true_as_default_visible() throws Exception {
		Method method = IdeProperty.class.getDeclaredMethod("visible");
		assertThat(method.getDefaultValue()).isEqualTo(true);
	}

	@Test
	void should_have_empty_string_as_default_enumValues() throws Exception {
		Method method = IdeProperty.class.getDeclaredMethod("enumValues");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_zero_as_default_highlight() throws Exception {
		Method method = IdeProperty.class.getDeclaredMethod("highlight");
		assertThat(method.getDefaultValue()).isEqualTo(0);
	}

	@Test
	void should_have_empty_string_as_default_editor() throws Exception {
		Method method = IdeProperty.class.getDeclaredMethod("editor");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}
}
