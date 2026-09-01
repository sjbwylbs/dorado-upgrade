package com.bstek.dorado.config.definition;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CreationContextTest {

	/**
	 * Minimal concrete implementation of Definition for testing.
	 */
	private static class TestDefinition extends Definition {
		@Override
		protected Object doCreate(CreationContext context, Object[] constuctorArgs) {
			return null;
		}
	}

	private CreationContext context;

	@BeforeEach
	void setUp() {
		context = new CreationContext();
	}

	@Test
	void should_have_null_default_impl_initially() {
		assertThat(context.getDefaultImpl()).isNull();
	}

	@Test
	void should_set_and_get_default_impl() {
		context.setDefaultImpl(String.class);

		assertThat(context.getDefaultImpl()).isEqualTo(String.class);
	}

	@Test
	void should_set_default_impl_to_different_types() {
		context.setDefaultImpl(Integer.class);
		assertThat(context.getDefaultImpl()).isEqualTo(Integer.class);

		context.setDefaultImpl(Runnable.class);
		assertThat(context.getDefaultImpl()).isEqualTo(Runnable.class);
	}

	@Test
	void should_return_null_for_find_instance_when_not_pushed() {
		TestDefinition definition = new TestDefinition();

		assertThat(context.findInstance(definition)).isNull();
	}

	@Test
	void should_find_pushed_instance() {
		TestDefinition definition = new TestDefinition();
		Object instance = new Object();

		context.pushInstanceStack(definition, instance);

		assertThat(context.findInstance(definition)).isSameAs(instance);
	}

	@Test
	void should_find_multiple_pushed_instances() {
		TestDefinition def1 = new TestDefinition();
		TestDefinition def2 = new TestDefinition();
		Object instance1 = "instance1";
		Object instance2 = "instance2";

		context.pushInstanceStack(def1, instance1);
		context.pushInstanceStack(def2, instance2);

		assertThat(context.findInstance(def1)).isEqualTo("instance1");
		assertThat(context.findInstance(def2)).isEqualTo("instance2");
	}

	@Test
	void should_remove_instance_from_stack() {
		TestDefinition definition = new TestDefinition();
		context.pushInstanceStack(definition, "value");
		assertThat(context.findInstance(definition)).isEqualTo("value");

		context.removeInstanceStack(definition);

		assertThat(context.findInstance(definition)).isNull();
	}

	@Test
	void should_overwrite_instance_for_same_definition() {
		TestDefinition definition = new TestDefinition();

		context.pushInstanceStack(definition, "oldValue");
		context.pushInstanceStack(definition, "newValue");

		assertThat(context.findInstance(definition)).isEqualTo("newValue");
	}

	@Test
	void should_not_fail_when_removing_nonexistent_definition() {
		TestDefinition definition = new TestDefinition();

		// Should not throw
		context.removeInstanceStack(definition);

		assertThat(context.findInstance(definition)).isNull();
	}
}
