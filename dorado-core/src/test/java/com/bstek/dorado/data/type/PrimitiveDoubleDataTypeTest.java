package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PrimitiveDoubleDataTypeTest {

	private PrimitiveDoubleDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new PrimitiveDoubleDataType();
	}

	@Test
	void should_return_zero_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isEqualTo(0.0);
	}

	@Test
	void should_return_zero_when_fromText_with_empty_string() {
		assertThat(dataType.fromText("")).isEqualTo(0.0);
	}

	@Test
	void should_return_double_when_fromText_with_valid_string() {
		assertThat(dataType.fromText("3.14")).isEqualTo(3.14);
	}

	@Test
	void should_return_zero_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isEqualTo(0.0);
	}

	@Test
	void should_return_double_when_fromObject_with_double() {
		assertThat(dataType.fromObject(3.14)).isEqualTo(3.14);
	}

	@Test
	void should_return_double_when_fromObject_with_integer() {
		assertThat(dataType.fromObject(42)).isEqualTo(42.0);
	}

	@Test
	void should_return_double_when_fromObject_with_string() {
		assertThat(dataType.fromObject("3.14")).isEqualTo(3.14);
	}
}
