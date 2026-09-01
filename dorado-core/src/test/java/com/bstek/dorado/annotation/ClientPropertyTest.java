package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

class ClientPropertyTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = ClientProperty.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_method_when_inspected() {
		Target target = ClientProperty.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactly(ElementType.METHOD);
	}

	@Test
	void should_be_inherited_when_inspected() {
		Inherited inherited = ClientProperty.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNotNull();
	}

	@Test
	void should_have_empty_string_as_default_propertyName() throws Exception {
		Method method = ClientProperty.class.getDeclaredMethod("propertyName");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_false_as_default_ignored() throws Exception {
		Method method = ClientProperty.class.getDeclaredMethod("ignored");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_empty_string_as_default_outputter() throws Exception {
		Method method = ClientProperty.class.getDeclaredMethod("outputter");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_empty_string_as_default_escapeValue() throws Exception {
		Method method = ClientProperty.class.getDeclaredMethod("escapeValue");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_false_as_default_alwaysOutput() throws Exception {
		Method method = ClientProperty.class.getDeclaredMethod("alwaysOutput");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_true_as_default_evaluateExpression() throws Exception {
		Method method = ClientProperty.class.getDeclaredMethod("evaluateExpression");
		assertThat(method.getDefaultValue()).isEqualTo(true);
	}
}
