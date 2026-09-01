package com.bstek.dorado.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CounterTest {

	private Counter counter;

	@BeforeEach
	void setUp() {
		counter = new Counter();
	}

	@Test
	void should_have_initial_value_zero() {
		assertThat(counter.getValue()).isEqualTo(0);
	}

	@Test
	void should_increase_value() {
		counter.increase();
		assertThat(counter.getValue()).isEqualTo(1);
	}

	@Test
	void should_decrease_value() {
		counter.decrease();
		assertThat(counter.getValue()).isEqualTo(-1);
	}

	@Test
	void should_increase_multiple_times() {
		counter.increase();
		counter.increase();
		counter.increase();
		assertThat(counter.getValue()).isEqualTo(3);
	}

	@Test
	void should_decrease_multiple_times() {
		counter.decrease();
		counter.decrease();
		assertThat(counter.getValue()).isEqualTo(-2);
	}

	@Test
	void should_set_value_directly() {
		counter.setValue(42);
		assertThat(counter.getValue()).isEqualTo(42);
	}

	@Test
	void should_increase_and_decrease() {
		counter.increase();
		counter.increase();
		counter.decrease();
		assertThat(counter.getValue()).isEqualTo(1);
	}

	@Test
	void should_set_value_to_negative() {
		counter.setValue(-10);
		assertThat(counter.getValue()).isEqualTo(-10);
	}
}
