package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PrimitiveIntDataTypeTest {

	private PrimitiveIntDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new PrimitiveIntDataType();
	}

	@Test
	void should_return_zero_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isEqualTo(0);
	}

	@Test
	void should_return_integer_when_fromText_with_valid_string() {
		assertThat(dataType.fromText("42")).isEqualTo(42);
	}

	@Test
	void should_return_zero_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isEqualTo(0);
	}

	@Test
	void should_return_integer_when_fromObject_with_integer() {
		assertThat(dataType.fromObject(42)).isEqualTo(42);
	}

	@Test
	void should_return_integer_when_fromObject_with_long() {
		assertThat(dataType.fromObject(42L)).isEqualTo(42);
	}

	@Test
	void should_return_integer_when_fromObject_with_string() {
		assertThat(dataType.fromObject("42")).isEqualTo(42);
	}
}
