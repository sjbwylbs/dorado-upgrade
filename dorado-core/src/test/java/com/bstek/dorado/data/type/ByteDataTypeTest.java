package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ByteDataTypeTest {

	private ByteDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new ByteDataType();
	}

	@Test
	void should_return_byte_when_fromText_with_valid_string() {
		assertThat(dataType.fromText("42")).isEqualTo((byte) 42);
	}

	@Test
	void should_return_null_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isNull();
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
	void should_return_same_byte_when_fromObject_with_byte() {
		assertThat(dataType.fromObject((byte) 42)).isEqualTo((byte) 42);
	}

	@Test
	void should_return_byte_value_when_fromObject_with_integer() {
		assertThat(dataType.fromObject(42)).isEqualTo((byte) 42);
	}

	@Test
	void should_return_byte_value_when_fromObject_with_string() {
		assertThat(dataType.fromObject("42")).isEqualTo((byte) 42);
	}

	@Test
	void should_throw_when_fromObject_with_unsupported_type() {
		assertThatThrownBy(() -> dataType.fromObject(new Object()))
				.isInstanceOf(DataConvertException.class);
	}
}
