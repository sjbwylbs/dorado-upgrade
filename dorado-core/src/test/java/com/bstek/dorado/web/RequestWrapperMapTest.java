package com.bstek.dorado.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.servlet.http.HttpServletRequest;

class RequestWrapperMapTest {

	private HttpServletRequest request;
	private RequestWrapperMap map;

	@BeforeEach
	void setUp() {
		request = mock(HttpServletRequest.class);
		map = new RequestWrapperMap(request);
	}

	@Test
	void should_return_attribute_value_for_get() {
		when(request.getAttribute("key")).thenReturn("value");

		assertThat(map.get("key")).isEqualTo("value");
	}

	@Test
	void should_return_null_for_missing_attribute() {
		when(request.getAttribute("missing")).thenReturn(null);

		assertThat(map.get("missing")).isNull();
	}

	@Test
	void should_set_attribute_via_put() {
		Object result = map.put("key", "value");

		verify(request).setAttribute("key", "value");
		assertThat(result).isEqualTo("value");
	}

	@Test
	void should_return_null_object_for_nonexistent_attribute() {
		when(request.getAttribute("any")).thenReturn(null);

		assertThat(map.get("any")).isNull();
	}

	@Test
	void should_throw_unsupported_for_size() {
		assertThatThrownBy(() -> map.size()).isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_throw_unsupported_for_isEmpty() {
		assertThatThrownBy(() -> map.isEmpty()).isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_throw_unsupported_for_containsKey() {
		assertThatThrownBy(() -> map.containsKey("key")).isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_throw_unsupported_for_containsValue() {
		assertThatThrownBy(() -> map.containsValue("value")).isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_throw_unsupported_for_remove() {
		assertThatThrownBy(() -> map.remove("key")).isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_throw_unsupported_for_putAll() {
		assertThatThrownBy(() -> map.putAll(null)).isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_throw_unsupported_for_clear() {
		assertThatThrownBy(() -> map.clear()).isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_throw_unsupported_for_keySet() {
		assertThatThrownBy(() -> map.keySet()).isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_throw_unsupported_for_values() {
		assertThatThrownBy(() -> map.values()).isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_throw_unsupported_for_entrySet() {
		assertThatThrownBy(() -> map.entrySet()).isInstanceOf(UnsupportedOperationException.class);
	}

	@Test
	void should_return_object_type_attribute() {
		Object obj = new Object();
		when(request.getAttribute("obj")).thenReturn(obj);

		assertThat(map.get("obj")).isSameAs(obj);
	}
}
