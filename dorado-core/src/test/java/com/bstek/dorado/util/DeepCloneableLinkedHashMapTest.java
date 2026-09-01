package com.bstek.dorado.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DeepCloneableLinkedHashMapTest {

	@Test
	void should_create_empty_map() {
		DeepCloneableLinkedHashMap<String, String> map = new DeepCloneableLinkedHashMap<>();
		assertThat(map).isEmpty();
	}

	@Test
	void should_put_and_get() {
		DeepCloneableLinkedHashMap<String, String> map = new DeepCloneableLinkedHashMap<>();
		map.put("key", "value");
		assertThat(map.get("key")).isEqualTo("value");
	}

	@Test
	void should_clone_empty_map() {
		DeepCloneableLinkedHashMap<String, String> map = new DeepCloneableLinkedHashMap<>();
		@SuppressWarnings("unchecked")
		DeepCloneableLinkedHashMap<String, String> cloned = (DeepCloneableLinkedHashMap<String, String>) map.clone();
		assertThat(cloned).isEmpty();
		assertThat(cloned).isNotSameAs(map);
	}

	@Test
	void should_clone_map_with_non_cloneable_values() {
		DeepCloneableLinkedHashMap<String, String> map = new DeepCloneableLinkedHashMap<>();
		map.put("key", "value");
		@SuppressWarnings("unchecked")
		DeepCloneableLinkedHashMap<String, String> cloned = (DeepCloneableLinkedHashMap<String, String>) map.clone();
		assertThat(cloned.get("key")).isEqualTo("value");
		// String is not Cloneable in practice (no public clone method), so same reference
		assertThat(cloned.get("key")).isSameAs("value");
	}

	@Test
	void should_clone_map_with_cloneable_values() {
		DeepCloneableLinkedHashMap<String, java.util.ArrayList<String>> map = new DeepCloneableLinkedHashMap<>();
		java.util.ArrayList<String> list = new java.util.ArrayList<>();
		list.add("hello");
		map.put("key", list);
		@SuppressWarnings("unchecked")
		DeepCloneableLinkedHashMap<String, java.util.ArrayList<String>> cloned = (DeepCloneableLinkedHashMap<String, java.util.ArrayList<String>>) map
				.clone();
		// ArrayList is Cloneable with public clone(), so cloned value should be different instance
		assertThat(cloned.get("key")).isNotSameAs(list);
		assertThat(cloned.get("key")).containsExactly("hello");
	}

	@Test
	void should_maintain_insertion_order() {
		DeepCloneableLinkedHashMap<String, Integer> map = new DeepCloneableLinkedHashMap<>();
		map.put("c", 3);
		map.put("a", 1);
		map.put("b", 2);
		assertThat(map.keySet()).containsExactly("c", "a", "b");
	}

	@Test
	void should_handle_null_values() {
		DeepCloneableLinkedHashMap<String, String> map = new DeepCloneableLinkedHashMap<>();
		map.put("key", null);
		@SuppressWarnings("unchecked")
		DeepCloneableLinkedHashMap<String, String> cloned = (DeepCloneableLinkedHashMap<String, String>) map.clone();
		assertThat(cloned.get("key")).isNull();
	}
}
