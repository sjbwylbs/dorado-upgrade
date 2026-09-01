package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.junit.jupiter.api.Test;

class ClientEventsTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = ClientEvents.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_type_when_inspected() {
		Target target = ClientEvents.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactly(ElementType.TYPE);
	}

	@Test
	void should_not_be_inherited_when_inspected() {
		Inherited inherited = ClientEvents.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNull();
	}
}
