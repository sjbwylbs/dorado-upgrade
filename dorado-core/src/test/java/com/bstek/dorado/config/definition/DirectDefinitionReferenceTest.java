package com.bstek.dorado.config.definition;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DirectDefinitionReferenceTest {

	/**
	 * Minimal concrete implementation of Definition for testing.
	 */
	private static class TestDefinition extends Definition {
		@Override
		protected Object doCreate(CreationContext context, Object[] constuctorArgs) {
			return null;
		}
	}

	@Test
	void should_return_definition_passed_in_constructor() {
		TestDefinition definition = new TestDefinition();
		DirectDefinitionReference<TestDefinition> reference = new DirectDefinitionReference<>(definition);

		assertThat(reference.getDefinition()).isSameAs(definition);
	}

	@Test
	void should_return_null_definition_when_constructed_with_null() {
		DirectDefinitionReference<TestDefinition> reference = new DirectDefinitionReference<>(null);

		assertThat(reference.getDefinition()).isNull();
	}

	@Test
	void should_implement_definition_reference_interface() {
		TestDefinition definition = new TestDefinition();
		DirectDefinitionReference<TestDefinition> reference = new DirectDefinitionReference<>(definition);

		assertThat(reference).isInstanceOf(DefinitionReference.class);
	}

	@Test
	void should_return_consistent_definition() {
		TestDefinition definition = new TestDefinition();
		DirectDefinitionReference<TestDefinition> reference = new DirectDefinitionReference<>(definition);

		TestDefinition result1 = reference.getDefinition();
		TestDefinition result2 = reference.getDefinition();

		assertThat(result1).isSameAs(result2);
	}
}
