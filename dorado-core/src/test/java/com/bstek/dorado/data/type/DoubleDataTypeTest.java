package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DoubleDataTypeTest {

	private DoubleDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new DoubleDataType();
	}

	@Test
	void should_return_double_when_fromText_with_valid_string() {
		assertThat(dataType.fromText("3.14")).isEqualTo(3.14);
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
	void should_return_same_double_when_fromObject_with_double() {
		assertThat(dataType.fromObject(3.14)).isEqualTo(3.14);
	}

	@Test
	void should_return_double_value_when_fromObject_with_integer() {
		assertThat(dataType.fromObject(42)).isEqualTo(42.0);
	}

	@Test
	void should_return_double_value_when_fromObject_with_float() {
		assertThat(dataType.fromObject(3.14f)).isInstanceOf(Double.class);
	}

	@Test
	void should_return_double_value_when_fromObject_with_string() {
		assertThat(dataType.fromObject("3.14")).isEqualTo(3.14);
	}

	@Test
	void should_throw_when_fromObject_with_unsupported_type() {
		assertThatThrownBy(() -> dataType.fromObject(new Object()))
				.isInstanceOf(DataConvertException.class);
	}
}
