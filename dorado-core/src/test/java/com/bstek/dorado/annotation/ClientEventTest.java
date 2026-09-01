package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

class ClientEventTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = ClientEvent.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_field_when_inspected() {
		Target target = ClientEvent.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactly(ElementType.FIELD);
	}

	@Test
	void should_not_be_inherited_when_inspected() {
		Inherited inherited = ClientEvent.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNull();
	}

	@Test
	void should_have_empty_string_as_default_signature() throws Exception {
		Method method = ClientEvent.class.getDeclaredMethod("signature");
		assertThat(method.getDefaultValue()).isEqualTo(new String[] { "" });
	}

	@Test
	void should_have_false_as_default_deprecated() throws Exception {
		Method method = ClientEvent.class.getDeclaredMethod("deprecated");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_empty_array_as_default_clientTypes() throws Exception {
		Method method = ClientEvent.class.getDeclaredMethod("clientTypes");
		assertThat(method.getDefaultValue()).isEqualTo(new int[] {});
	}
}
