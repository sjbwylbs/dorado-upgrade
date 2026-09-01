package com.bstek.dorado.util;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

class AssertTest {

	// isTrue tests
	@Test
	void isTrue_should_pass_for_true() {
		Assert.isTrue(true, "should pass");
	}

	@Test
	void isTrue_should_throw_for_false() {
		assertThatThrownBy(() -> Assert.isTrue(false, "expected true"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("expected true");
	}

	@Test
	void isTrue_default_message() {
		assertThatThrownBy(() -> Assert.isTrue(false))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Assertion failed");
	}

	// isNull tests
	@Test
	void isNull_should_pass_for_null() {
		Assert.isNull(null, "should pass");
	}

	@Test
	void isNull_should_throw_for_non_null() {
		assertThatThrownBy(() -> Assert.isNull("value", "expected null"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("expected null");
	}

	@Test
	void isNull_default_message() {
		assertThatThrownBy(() -> Assert.isNull("value"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Assertion failed");
	}

	// notNull tests
	@Test
	void notNull_should_pass_for_non_null() {
		Assert.notNull("value", "should pass");
	}

	@Test
	void notNull_should_throw_for_null() {
		assertThatThrownBy(() -> Assert.notNull(null, "expected not null"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("expected not null");
	}

	@Test
	void notNull_default_message() {
		assertThatThrownBy(() -> Assert.notNull(null))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Assertion failed");
	}

	// notEmpty(String) tests
	@Test
	void notEmpty_string_should_pass_for_non_empty() {
		Assert.notEmpty("hello", "should pass");
	}

	@Test
	void notEmpty_string_should_throw_for_empty() {
		assertThatThrownBy(() -> Assert.notEmpty("", "must not be empty"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("must not be empty");
	}

	@Test
	void notEmpty_string_should_throw_for_null() {
		assertThatThrownBy(() -> Assert.notEmpty((String) null, "must not be null"))
				.isInstanceOf(IllegalArgumentException.class);
	}

	// notEmpty(Object[]) tests
	@Test
	void notEmpty_array_should_pass_for_non_empty() {
		Assert.notEmpty(new Object[] { "a" }, "should pass");
	}

	@Test
	void notEmpty_array_should_throw_for_empty() {
		assertThatThrownBy(() -> Assert.notEmpty(new Object[] {}, "must not be empty"))
				.isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void notEmpty_array_should_throw_for_null() {
		assertThatThrownBy(() -> Assert.notEmpty((Object[]) null, "must not be null"))
				.isInstanceOf(IllegalArgumentException.class);
	}

	// notEmpty(Collection) tests
	@Test
	void notEmpty_collection_should_pass_for_non_empty() {
		List<String> list = new ArrayList<>();
		list.add("a");
		Assert.notEmpty(list, "should pass");
	}

	@Test
	void notEmpty_collection_should_throw_for_empty() {
		assertThatThrownBy(() -> Assert.notEmpty(new ArrayList<>(), "must not be empty"))
				.isInstanceOf(IllegalArgumentException.class);
	}

	// notEmpty(Map) tests
	@Test
	void notEmpty_map_should_pass_for_non_empty() {
		Map<String, String> map = new HashMap<>();
		map.put("k", "v");
		Assert.notEmpty(map, "should pass");
	}

	@Test
	void notEmpty_map_should_throw_for_empty() {
		assertThatThrownBy(() -> Assert.notEmpty(new HashMap<>(), "must not be empty"))
				.isInstanceOf(IllegalArgumentException.class);
	}

	// doesNotContain tests
	@Test
	void doesNotContain_should_pass_when_not_contained() {
		Assert.doesNotContain("hello world", "xyz", "should pass");
	}

	@Test
	void doesNotContain_should_throw_when_contained() {
		assertThatThrownBy(() -> Assert.doesNotContain("hello world", "world", "must not contain"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("must not contain");
	}

	// isInstanceOf tests
	@Test
	void isInstanceOf_should_pass_for_correct_type() {
		Assert.isInstanceOf(String.class, "hello", "should pass");
	}

	@Test
	void isInstanceOf_should_throw_for_wrong_type() {
		assertThatThrownBy(() -> Assert.isInstanceOf(String.class, 42, "wrong type"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("wrong type");
	}

	// isAssignable tests
	@Test
	void isAssignable_should_pass_for_assignable() {
		Assert.isAssignable(Object.class, String.class, "should pass");
	}

	@Test
	void isAssignable_should_throw_for_not_assignable() {
		assertThatThrownBy(() -> Assert.isAssignable(String.class, Integer.class, "not assignable"))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("not assignable");
	}
}
