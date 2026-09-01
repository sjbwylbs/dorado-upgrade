package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.view.task.LongTaskScope;

class TaskSchedulerTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = TaskScheduler.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_method_when_inspected() {
		Target target = TaskScheduler.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactly(ElementType.METHOD);
	}

	@Test
	void should_be_inherited_when_inspected() {
		Inherited inherited = TaskScheduler.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNotNull();
	}

	@Test
	void should_have_empty_string_as_default_impl() throws Exception {
		Method method = TaskScheduler.class.getDeclaredMethod("impl");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_session_as_default_scope() throws Exception {
		Method method = TaskScheduler.class.getDeclaredMethod("scope");
		assertThat(method.getDefaultValue()).isEqualTo(LongTaskScope.session);
	}

	@Test
	void should_have_zero_as_default_maxRunning() throws Exception {
		Method method = TaskScheduler.class.getDeclaredMethod("maxRunning");
		assertThat(method.getDefaultValue()).isEqualTo(0);
	}

	@Test
	void should_have_integer_max_value_as_default_maxWaiting() throws Exception {
		Method method = TaskScheduler.class.getDeclaredMethod("maxWaiting");
		assertThat(method.getDefaultValue()).isEqualTo(Integer.MAX_VALUE);
	}
}
