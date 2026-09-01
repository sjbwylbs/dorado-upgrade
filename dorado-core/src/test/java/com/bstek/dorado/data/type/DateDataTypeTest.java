package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DateDataTypeTest {

	private DateDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new DateDataType();
	}

	// fromText tests
	@Test
	void should_return_null_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isNull();
	}

	@Test
	void should_return_null_when_fromText_with_empty_string() {
		assertThat(dataType.fromText("")).isNull();
	}

	@Test
	void should_return_date_when_fromText_with_timestamp() {
		long now = System.currentTimeMillis();
		Object result = dataType.fromText(String.valueOf(now));
		assertThat(result).isInstanceOf(Date.class);
		assertThat(((Date) result).getTime()).isEqualTo(now);
	}

	@Test
	void should_return_date_when_fromText_with_iso_date_format() {
		Object result = dataType.fromText("2023-06-15");
		assertThat(result).isInstanceOf(Date.class);
	}

	@Test
	void should_return_date_when_fromText_with_iso_datetime_format() {
		// Use format that matches ISO_DATETIME_FORMAT1: yyyy-MM-ddTHH:mm:ss (length 19)
		// This format is handled by DateUtils.parse fallback
		Object result = dataType.fromText("2023-06-15 10:30:00");
		assertThat(result).isInstanceOf(Date.class);
	}

	// fromObject tests
	@Test
	void should_return_null_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isNull();
	}

	@Test
	void should_return_same_date_when_fromObject_with_date() {
		Date date = new Date();
		Object result = dataType.fromObject(date);
		assertThat(result).isInstanceOf(Date.class);
		assertThat(result).isSameAs(date);
	}

	@Test
	void should_return_date_when_fromObject_with_long() {
		long now = System.currentTimeMillis();
		Object result = dataType.fromObject(now);
		assertThat(result).isInstanceOf(Date.class);
		assertThat(((Date) result).getTime()).isEqualTo(now);
	}

	@Test
	void should_return_date_when_fromObject_with_timestamp_string() {
		long now = System.currentTimeMillis();
		Object result = dataType.fromObject(String.valueOf(now));
		assertThat(result).isInstanceOf(Date.class);
		assertThat(((Date) result).getTime()).isEqualTo(now);
	}

	@Test
	void should_throw_when_fromObject_with_unsupported_type() {
		assertThatThrownBy(() -> dataType.fromObject(new Object()))
				.isInstanceOf(DataConvertException.class);
	}

	// toText tests
	@Test
	void should_return_null_when_toText_with_null() {
		assertThat(dataType.toText(null)).isNull();
	}

	@Test
	void should_return_timestamp_string_when_toText_with_date() {
		Date date = new Date(1000000L);
		assertThat(dataType.toText(date)).isEqualTo("1000000");
	}
}
