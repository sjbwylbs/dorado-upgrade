package com.bstek.dorado.core;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MapConfigureStoreTest {

	private MapConfigureStore store;
	private Map<String, Object> map;

	@BeforeEach
	void setUp() {
		map = new HashMap<>();
		store = new MapConfigureStore(map);
	}

	@Test
	void should_create_from_map() {
		map.put("key1", "value1");
		MapConfigureStore storeFromMap = new MapConfigureStore(map);

		assertThat(storeFromMap.contains("key1")).isTrue();
		assertThat(storeFromMap.get("key1")).isEqualTo("value1");
	}

	@Test
	void should_create_from_properties() {
		Properties properties = new Properties();
		properties.setProperty("prop1", "val1");
		MapConfigureStore storeFromProps = new MapConfigureStore(properties);

		assertThat(storeFromProps.contains("prop1")).isTrue();
		assertThat(storeFromProps.getString("prop1")).isEqualTo("val1");
	}

	@Test
	void should_return_true_for_contains_when_key_exists() {
		map.put("existingKey", "value");

		assertThat(store.contains("existingKey")).isTrue();
	}

	@Test
	void should_return_false_for_contains_when_key_missing() {
		assertThat(store.contains("nonExistentKey")).isFalse();
	}

	@Test
	void should_return_value_for_get() {
		map.put("key", "value");

		assertThat(store.get("key")).isEqualTo("value");
	}

	@Test
	void should_return_null_for_get_when_key_missing() {
		assertThat(store.get("missing")).isNull();
	}

	@Test
	void should_remove_key() {
		map.put("key", "value");
		assertThat(store.contains("key")).isTrue();

		store.remove("key");

		assertThat(store.contains("key")).isFalse();
		assertThat(store.get("key")).isNull();
	}

	@Test
	void should_set_value_via_set_method() {
		store.set("newKey", "newValue");

		assertThat(store.get("newKey")).isEqualTo("newValue");
		assertThat(map).containsKey("newKey");
	}

	@Test
	void should_remove_key_when_set_with_null() {
		map.put("key", "value");
		assertThat(store.contains("key")).isTrue();

		store.set("key", null);

		assertThat(store.contains("key")).isFalse();
	}

	@Test
	void should_return_key_set() {
		map.put("key1", "value1");
		map.put("key2", "value2");

		Set<String> keys = store.keySet();
		assertThat(keys).containsExactlyInAnyOrder("key1", "key2");
	}

	@Test
	void should_return_empty_key_set_when_no_entries() {
		assertThat(store.keySet()).isEmpty();
	}

	// Inherited ConfigureStore type conversion methods
	@Test
	void should_return_string_value() {
		map.put("key", 123);

		assertThat(store.getString("key")).isEqualTo("123");
	}

	@Test
	void should_return_null_string_when_key_missing() {
		assertThat(store.getString("missing")).isNull();
	}

	@Test
	void should_return_default_string_when_key_missing() {
		assertThat(store.getString("missing", "default")).isEqualTo("default");
	}

	@Test
	void should_return_boolean_true() {
		map.put("key", "true");

		assertThat(store.getBoolean("key")).isTrue();
	}

	@Test
	void should_return_boolean_false() {
		map.put("key", "false");

		assertThat(store.getBoolean("key")).isFalse();
	}

	@Test
	void should_return_boolean_from_boolean_object() {
		map.put("key", Boolean.TRUE);

		assertThat(store.getBoolean("key")).isTrue();
	}

	@Test
	void should_return_default_boolean_when_key_missing() {
		assertThat(store.getBoolean("missing", true)).isTrue();
		assertThat(store.getBoolean("missing", false)).isFalse();
	}

	@Test
	void should_return_long_from_number() {
		map.put("key", 42L);

		assertThat(store.getLong("key")).isEqualTo(42L);
	}

	@Test
	void should_return_long_from_string() {
		map.put("key", "100");

		assertThat(store.getLong("key")).isEqualTo(100L);
	}

	@Test
	void should_return_default_long_when_key_missing() {
		assertThat(store.getLong("missing", 99L)).isEqualTo(99L);
	}
}
