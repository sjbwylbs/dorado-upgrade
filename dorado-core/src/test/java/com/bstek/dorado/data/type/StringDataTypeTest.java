package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class StringDataTypeTest {

	private StringDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new StringDataType();
	}

	@Test
	void should_return_text_when_fromText_called() {
		assertThat(dataType.fromText("hello")).isEqualTo("hello");
	}

	@Test
	void should_return_null_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isNull();
	}

	@Test
	void should_return_empty_string_when_fromText_with_empty() {
		assertThat(dataType.fromText("")).isEqualTo("");
	}

	@Test
	void should_return_toString_when_fromObject_with_integer() {
		assertThat(dataType.fromObject(42)).isEqualTo("42");
	}

	@Test
	void should_return_toString_when_fromObject_with_boolean() {
		assertThat(dataType.fromObject(true)).isEqualTo("true");
	}

	@Test
	void should_return_null_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isNull();
	}

	@Test
	void should_return_same_string_when_fromObject_with_string() {
		assertThat(dataType.fromObject("hello")).isEqualTo("hello");
	}

	@Test
	void should_return_toString_when_fromObject_with_double() {
		assertThat(dataType.fromObject(3.14)).isEqualTo("3.14");
	}
}
