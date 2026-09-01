package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ShortDataTypeTest {

	private ShortDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new ShortDataType();
	}

	@Test
	void should_return_short_when_fromText_with_valid_string() {
		assertThat(dataType.fromText("1000")).isEqualTo((short) 1000);
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
	void should_return_same_short_when_fromObject_with_short() {
		assertThat(dataType.fromObject((short) 1000)).isEqualTo((short) 1000);
	}

	@Test
	void should_return_short_value_when_fromObject_with_integer() {
		assertThat(dataType.fromObject(1000)).isEqualTo((short) 1000);
	}

	@Test
	void should_return_short_value_when_fromObject_with_string() {
		assertThat(dataType.fromObject("1000")).isEqualTo((short) 1000);
	}

	@Test
	void should_throw_when_fromObject_with_unsupported_type() {
		assertThatThrownBy(() -> dataType.fromObject(new Object()))
				.isInstanceOf(DataConvertException.class);
	}
}
