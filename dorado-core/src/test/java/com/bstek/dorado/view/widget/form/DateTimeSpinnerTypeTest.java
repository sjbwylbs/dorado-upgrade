package com.bstek.dorado.view.widget.form;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DateTimeSpinnerTypeTest {

	@Test
	void should_contain_all_values() {
		assertThat(DateTimeSpinnerType.values()).containsExactly(
				DateTimeSpinnerType.date, DateTimeSpinnerType.time, DateTimeSpinnerType.dateTime,
				DateTimeSpinnerType.hours, DateTimeSpinnerType.minutes,
				DateTimeSpinnerType.dateHours, DateTimeSpinnerType.dateMinutes);
	}

	@Test
	void should_have_exactly_seven_values() {
		assertThat(DateTimeSpinnerType.values()).hasSize(7);
	}
}
