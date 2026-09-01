package com.bstek.dorado.console.web;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DoradoObjectTest {

	private DoradoObject obj;

	@BeforeEach
	void setUp() {
		obj = new DoradoObject();
	}

	@Test
	void should_return_null_name_by_default() {
		assertThat(obj.getName()).isNull();
	}

	@Test
	void should_return_null_bean_by_default() {
		assertThat(obj.getBean()).isNull();
	}

	@Test
	void should_return_null_method_by_default() {
		assertThat(obj.getMethod()).isNull();
	}

	@Test
	void should_set_and_get_name() {
		obj.setName("testObject");
		assertThat(obj.getName()).isEqualTo("testObject");
	}

	@Test
	void should_set_and_get_bean() {
		obj.setBean("myBean");
		assertThat(obj.getBean()).isEqualTo("myBean");
	}

	@Test
	void should_set_and_get_method() {
		obj.setMethod("execute");
		assertThat(obj.getMethod()).isEqualTo("execute");
	}

	@Test
	void should_set_and_get_type() {
		obj.setType(DoradoObject.Type.ExposedService);
		assertThat(obj.getTypeName()).isEqualTo("ExposedService");
	}

	@Test
	void should_return_type_name_for_all_types() {
		obj.setType(DoradoObject.Type.DataType);
		assertThat(obj.getTypeName()).isEqualTo("DataType");

		obj.setType(DoradoObject.Type.DataProvider);
		assertThat(obj.getTypeName()).isEqualTo("DataProvider");

		obj.setType(DoradoObject.Type.DataResolver);
		assertThat(obj.getTypeName()).isEqualTo("DataResolver");

		obj.setType(DoradoObject.Type.ViewConfig);
		assertThat(obj.getTypeName()).isEqualTo("ViewConfig");
	}

	@Test
	void should_have_five_type_values() {
		assertThat(DoradoObject.Type.values()).hasSize(5);
	}
}
