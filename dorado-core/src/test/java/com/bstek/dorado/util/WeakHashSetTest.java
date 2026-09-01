package com.bstek.dorado.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class WeakHashSetTest {

	private WeakHashSet<String> set;

	@BeforeEach
	void setUp() {
		set = new WeakHashSet<>();
	}

	@Test
	void should_be_empty_initially() {
		assertThat(set).isEmpty();
		assertThat(set.size()).isEqualTo(0);
	}

	@Test
	void should_add_element() {
		set.add("hello");
		assertThat(set).contains("hello");
		assertThat(set.size()).isEqualTo(1);
	}

	@Test
	void should_not_add_duplicate() {
		set.add("hello");
		boolean added = set.add("hello");
		assertThat(added).isFalse();
		assertThat(set.size()).isEqualTo(1);
	}

	@Test
	void should_remove_element() {
		set.add("hello");
		set.remove("hello");
		assertThat(set).isEmpty();
	}

	@Test
	void should_return_true_when_removing_non_existent_due_to_weak_map_semantics() {
		// WeakHashSet.remove() returns map.remove(o) != PRESENT
		// When key not found, map.remove returns null, null != PRESENT is true
		boolean removed = set.remove("nonexistent");
		assertThat(removed).isTrue();
	}

	@Test
	void should_clear_all_elements() {
		set.add("a");
		set.add("b");
		set.add("c");
		set.clear();
		assertThat(set).isEmpty();
	}

	@Test
	void should_check_contains() {
		set.add("hello");
		assertThat(set.contains("hello")).isTrue();
		assertThat(set.contains("world")).isFalse();
	}

	@Test
	void should_add_all_from_collection() {
		java.util.List<String> list = java.util.List.of("a", "b", "c");
		set.addAll(list);
		assertThat(set).containsExactlyInAnyOrder("a", "b", "c");
	}

	@Test
	void should_check_contains_all() {
		set.add("a");
		set.add("b");
		assertThat(set.containsAll(java.util.List.of("a", "b"))).isTrue();
		assertThat(set.containsAll(java.util.List.of("a", "c"))).isFalse();
	}

	@Test
	void should_convert_to_array() {
		set.add("a");
		set.add("b");
		Object[] arr = set.toArray();
		assertThat(arr).hasSize(2);
	}

	@Test
	void should_iterate_over_elements() {
		set.add("a");
		set.add("b");
		int count = 0;
		for (String s : set) {
			count++;
		}
		assertThat(count).isEqualTo(2);
	}
}
