package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class IntegerDataTypeTest {

	private IntegerDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new IntegerDataType();
	}

	// fromText tests
	@Test
	void should_return_integer_when_fromText_with_valid_string() {
		assertThat(dataType.fromText("42")).isEqualTo(42);
	}

	@Test
	void should_return_null_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isNull();
	}

	@Test
	void should_return_negative_integer_when_fromText_with_negative() {
		assertThat(dataType.fromText("-10")).isEqualTo(-10);
	}

	@Test
	void should_throw_when_fromText_with_invalid_string() {
		assertThatThrownBy(() -> dataType.fromText("abc"))
				.isInstanceOf(NumberFormatException.class);
	}

	// fromObject tests
	@Test
	void should_return_null_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isNull();
	}

	@Test
	void should_return_same_integer_when_fromObject_with_integer() {
		assertThat(dataType.fromObject(42)).isEqualTo(42);
	}

	@Test
	void should_return_int_value_when_fromObject_with_long() {
		assertThat(dataType.fromObject(42L)).isEqualTo(42);
	}

	@Test
	void should_return_int_value_when_fromObject_with_double() {
		assertThat(dataType.fromObject(42.9)).isEqualTo(42);
	}

	@Test
	void should_return_int_value_when_fromObject_with_string() {
		assertThat(dataType.fromObject("42")).isEqualTo(42);
	}

	@Test
	void should_throw_when_fromObject_with_unsupported_type() {
		assertThatThrownBy(() -> dataType.fromObject(new Object()))
				.isInstanceOf(DataConvertException.class);
	}
}
