package com.bstek.dorado.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.servlet.http.HttpServletRequest;

class RequestParameterWrapperMapTest {

	private HttpServletRequest request;
	private RequestParameterWrapperMap map;

	@BeforeEach
	void setUp() {
		request = mock(HttpServletRequest.class);
		map = new RequestParameterWrapperMap(request);
	}

	@Test
	void should_return_parameter_value_for_get() {
		when(request.getParameter("name")).thenReturn("John");

		assertThat(map.get("name")).isEqualTo("John");
	}

	@Test
	void should_return_null_for_missing_parameter() {
		when(request.getParameter("missing")).thenReturn(null);

		assertThat(map.get("missing")).isNull();
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
	void should_throw_unsupported_for_put() {
		assertThatThrownBy(() -> map.put("key", "value")).isInstanceOf(UnsupportedOperationException.class);
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
	void should_return_empty_string_parameter() {
		when(request.getParameter("empty")).thenReturn("");

		assertThat(map.get("empty")).isEqualTo("");
	}
}
