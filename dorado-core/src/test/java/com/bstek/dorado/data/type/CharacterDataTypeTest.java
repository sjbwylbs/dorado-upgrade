package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CharacterDataTypeTest {

	private CharacterDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new CharacterDataType();
	}

	@Test
	void should_return_first_char_when_fromText_with_string() {
		assertThat(dataType.fromText("hello")).isEqualTo('h');
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
	void should_return_single_char_when_fromText_with_single_char() {
		assertThat(dataType.fromText("A")).isEqualTo('A');
	}

	@Test
	void should_return_null_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isNull();
	}

	@Test
	void should_return_same_char_when_fromObject_with_character() {
		assertThat(dataType.fromObject('A')).isEqualTo('A');
	}

	@Test
	void should_return_first_char_when_fromObject_with_string() {
		assertThat(dataType.fromObject("hello")).isEqualTo('h');
	}

	@Test
	void should_throw_when_fromObject_with_unsupported_type() {
		assertThatThrownBy(() -> dataType.fromObject(new Object()))
				.isInstanceOf(DataConvertException.class);
	}
}
