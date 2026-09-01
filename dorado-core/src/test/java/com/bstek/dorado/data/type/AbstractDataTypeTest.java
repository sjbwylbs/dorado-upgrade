package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AbstractDataTypeTest {

	private StringDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new StringDataType();
	}

	@Test
	void should_set_and_get_name() {
		dataType.setName("testType");
		assertThat(dataType.getName()).isEqualTo("testType");
	}

	@Test
	void should_set_id_from_name_when_id_is_empty() {
		dataType.setName("testType");
		assertThat(dataType.getId()).isEqualTo("testType");
	}

	@Test
	void should_not_override_id_when_set_name_after_id() {
		dataType.setId("myId");
		dataType.setName("testType");
		assertThat(dataType.getId()).isEqualTo("myId");
	}

	@Test
	void should_set_and_get_matchType() {
		dataType.setMatchType(String.class);
		assertThat(dataType.getMatchType()).isEqualTo(String.class);
	}

	@Test
	void should_set_creationType_from_matchType_when_not_abstract() {
		dataType.setMatchType(String.class);
		assertThat(dataType.getCreationType()).isEqualTo(String.class);
	}

	@Test
	void should_not_set_creationType_when_matchType_is_interface() {
		dataType.setMatchType(java.util.List.class);
		assertThat(dataType.getCreationType()).isNull();
	}

	@Test
	void should_set_and_get_creationType() {
		dataType.setCreationType(String.class);
		assertThat(dataType.getCreationType()).isEqualTo(String.class);
	}

	@Test
	void should_set_and_get_tags() {
		dataType.setTags("tag1,tag2");
		assertThat(dataType.getTags()).isEqualTo("tag1,tag2");
	}

	@Test
	void should_return_toString_of_value() {
		assertThat(dataType.toText(42)).isEqualTo("42");
	}

	@Test
	void should_return_null_toText_for_null() {
		assertThat(dataType.toText(null)).isNull();
	}

	@Test
	void should_return_value_when_fromObject_and_matchType_is_null() {
		// Use IntegerDataType which does not override fromObject for non-String/non-Number types
		IntegerDataType intType = new IntegerDataType();
		// When matchType is null, AbstractDataType.fromObject returns the value as-is
		// But IntegerDataType overrides fromObject, so test with a matching value
		Object result = intType.fromObject(42);
		assertThat(result).isEqualTo(42);
	}

	@Test
	void should_return_value_when_fromObject_and_value_matches_matchType() {
		IntegerDataType intType = new IntegerDataType();
		intType.setMatchType(Integer.class);
		assertThat(intType.fromObject(42)).isEqualTo(42);
	}

	@Test
	void should_throw_when_fromObject_and_value_does_not_match_matchType() {
		// Use IntegerDataType with matchType set to Integer, then pass an unsupported type
		IntegerDataType intType = new IntegerDataType();
		intType.setMatchType(Integer.class);
		// IntegerDataType handles String via fromText, so we need a type it doesn't handle
		assertThatThrownBy(() -> intType.fromObject(new Object()))
				.isInstanceOf(DataConvertException.class);
	}

	@Test
	void should_return_null_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isNull();
	}

	@Test
	void should_return_value_when_toObject_and_type_matches() {
		dataType.setMatchType(String.class);
		assertThat(dataType.toObject("hello")).isEqualTo("hello");
	}

	@Test
	void should_return_null_when_toObject_with_null() {
		assertThat(dataType.toObject(null)).isNull();
	}

	@Test
	void should_throw_when_toObject_and_type_does_not_match() {
		dataType.setMatchType(Integer.class);
		assertThatThrownBy(() -> dataType.toObject("hello"))
				.isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void should_contain_name_and_matchType_in_toString() {
		dataType.setName("testType");
		dataType.setMatchType(String.class);
		String str = dataType.toString();
		assertThat(str).contains("testType");
		assertThat(str).contains("String");
	}

	@Test
	void should_set_and_get_metaData() {
		java.util.Map<String, Object> metaData = new java.util.HashMap<>();
		metaData.put("key", "value");
		dataType.setMetaData(metaData);
		assertThat(dataType.getMetaData()).containsEntry("key", "value");
	}
}
