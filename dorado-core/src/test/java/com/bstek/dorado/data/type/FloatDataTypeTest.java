package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FloatDataTypeTest {

	private FloatDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new FloatDataType();
	}

	@Test
	void should_return_float_when_fromText_with_valid_string() {
		assertThat(dataType.fromText("3.14")).isEqualTo(3.14f);
	}

	@Test
	void should_return_null_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isNull();
	}

	@Test
	void should_return_null_when_fromText_with_empty_string() {
		assertThat(dataType.fromText("")).isNull();
	}

	@Test
	void should_throw_when_fromText_with_invalid_string() {
		assertThatThrownBy(() -> dataType.fromText("abc"))
				.isInstanceOf(NumberFormatException.class);
	}

	@Test
	void should_return_null_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isNull();
	}

	@Test
	void should_return_same_float_when_fromObject_with_float() {
		assertThat(dataType.fromObject(3.14f)).isEqualTo(3.14f);
	}

	@Test
	void should_return_float_value_when_fromObject_with_integer() {
		assertThat(dataType.fromObject(42)).isEqualTo(42.0f);
	}

	@Test
	void should_return_float_value_when_fromObject_with_double() {
		assertThat(dataType.fromObject(3.14)).isInstanceOf(Float.class);
	}

	@Test
	void should_return_float_value_when_fromObject_with_string() {
		assertThat(dataType.fromObject("3.14")).isEqualTo(3.14f);
	}

	@Test
	void should_throw_when_fromObject_with_unsupported_type() {
		assertThatThrownBy(() -> dataType.fromObject(new Object()))
				.isInstanceOf(DataConvertException.class);
	}
}
