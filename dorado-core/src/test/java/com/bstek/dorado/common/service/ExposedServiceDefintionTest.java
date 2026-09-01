package com.bstek.dorado.common.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExposedServiceDefintionTest {

	private ExposedServiceDefintion definition;

	@BeforeEach
	void setUp() {
		definition = new ExposedServiceDefintion();
	}

	@Test
	void should_have_null_name_by_default() {
		assertThat(definition.getName()).isNull();
	}

	@Test
	void should_have_null_bean_by_default() {
		assertThat(definition.getBean()).isNull();
	}

	@Test
	void should_have_null_method_by_default() {
		assertThat(definition.getMethod()).isNull();
	}

	@Test
	void should_have_null_exDefinition_by_default() {
		assertThat(definition.getExDefinition()).isNull();
	}

	@Test
	void should_set_and_get_name() {
		definition.setName("myService");
		assertThat(definition.getName()).isEqualTo("myService");
	}

	@Test
	void should_set_and_get_bean() {
		definition.setBean("spring:myBean");
		assertThat(definition.getBean()).isEqualTo("spring:myBean");
	}

	@Test
	void should_set_and_get_method() {
		definition.setMethod("doSomething");
		assertThat(definition.getMethod()).isEqualTo("doSomething");
	}

	@Test
	void should_set_and_get_exDefinition() {
		Object exDef = new Object();
		definition.setExDefinition(exDef);
		assertThat(definition.getExDefinition()).isSameAs(exDef);
	}
}
