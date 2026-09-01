package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UUIDDataTypeTest {

	private UUIDDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new UUIDDataType();
	}

	@Test
	void should_return_uuid_when_fromText_with_valid_string() {
		String uuidStr = "550e8400-e29b-41d4-a716-446655440000";
		assertThat(dataType.fromText(uuidStr)).isEqualTo(UUID.fromString(uuidStr));
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
		assertThatThrownBy(() -> dataType.fromText("not-a-uuid"))
				.isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void should_return_null_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isNull();
	}

	@Test
	void should_return_same_uuid_when_fromObject_with_uuid() {
		UUID uuid = UUID.randomUUID();
		assertThat(dataType.fromObject(uuid)).isSameAs(uuid);
	}

	@Test
	void should_return_uuid_when_fromObject_with_valid_string() {
		String uuidStr = "550e8400-e29b-41d4-a716-446655440000";
		assertThat(dataType.fromObject(uuidStr)).isEqualTo(UUID.fromString(uuidStr));
	}

	@Test
	void should_throw_when_fromObject_with_unsupported_type() {
		assertThatThrownBy(() -> dataType.fromObject(new Object()))
				.isInstanceOf(DataConvertException.class);
	}
}
