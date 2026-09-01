package com.bstek.dorado.data.type;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Calendar;
import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CalendarDataTypeTest {

	private CalendarDataType dataType;

	@BeforeEach
	void setUp() {
		dataType = new CalendarDataType();
	}

	@Test
	void should_return_null_when_fromText_with_null() {
		assertThat(dataType.fromText(null)).isNull();
	}

	@Test
	void should_return_calendar_when_fromText_with_timestamp() {
		long now = System.currentTimeMillis();
		Object result = dataType.fromText(String.valueOf(now));
		assertThat(result).isInstanceOf(Calendar.class);
		assertThat(((Calendar) result).getTimeInMillis()).isEqualTo(now);
	}

	@Test
	void should_return_null_when_fromObject_with_null() {
		assertThat(dataType.fromObject(null)).isNull();
	}

	@Test
	void should_return_calendar_when_fromObject_with_date() {
		Date date = new Date();
		Object result = dataType.fromObject(date);
		assertThat(result).isInstanceOf(Calendar.class);
		assertThat(((Calendar) result).getTime()).isEqualTo(date);
	}

	@Test
	void should_return_calendar_when_fromObject_with_long() {
		long now = System.currentTimeMillis();
		Object result = dataType.fromObject(now);
		assertThat(result).isInstanceOf(Calendar.class);
		assertThat(((Calendar) result).getTimeInMillis()).isEqualTo(now);
	}

	@Test
	void should_return_calendar_when_fromObject_with_timestamp_string() {
		long now = System.currentTimeMillis();
		Object result = dataType.fromObject(String.valueOf(now));
		assertThat(result).isInstanceOf(Calendar.class);
		assertThat(((Calendar) result).getTimeInMillis()).isEqualTo(now);
	}
}
