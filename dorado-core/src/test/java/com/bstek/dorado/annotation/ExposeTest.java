package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.junit.jupiter.api.Test;

class ExposeTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = Expose.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_type_and_method_when_inspected() {
		Target target = Expose.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactlyInAnyOrder(ElementType.TYPE, ElementType.METHOD);
	}

	@Test
	void should_be_inherited_when_inspected() {
		Inherited inherited = Expose.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNotNull();
	}
}
