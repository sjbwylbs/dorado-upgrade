package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

class IdeSubObjectTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = IdeSubObject.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_method_when_inspected() {
		Target target = IdeSubObject.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactly(ElementType.METHOD);
	}

	@Test
	void should_be_inherited_when_inspected() {
		Inherited inherited = IdeSubObject.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNotNull();
	}

	@Test
	void should_have_true_as_default_visible() throws Exception {
		Method method = IdeSubObject.class.getDeclaredMethod("visible");
		assertThat(method.getDefaultValue()).isEqualTo(true);
	}
}
