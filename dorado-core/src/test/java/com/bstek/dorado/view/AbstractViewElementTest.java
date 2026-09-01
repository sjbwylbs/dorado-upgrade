package com.bstek.dorado.view;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AbstractViewElementTest {

	private TestViewElement element;

	@BeforeEach
	void setUp() {
		element = new TestViewElement();
	}

	@Test
	void should_return_null_id_by_default() {
		assertThat(element.getId()).isNull();
	}

	@Test
	void should_set_and_get_id() {
		element.setId("testId");
		assertThat(element.getId()).isEqualTo("testId");
	}

	@Test
	void should_throw_exception_when_changing_id_after_view_attached() throws Exception {
		// Use reflection to set the private view field
		Field viewField = AbstractViewElement.class.getDeclaredField("view");
		viewField.setAccessible(true);
		viewField.set(element, new DummyView());
		assertThatThrownBy(() -> element.setId("newId"))
				.isInstanceOf(IllegalStateException.class)
				.hasMessageContaining("Can not change the id property");
	}

	@Test
	void should_return_null_parent_by_default() {
		assertThat(element.getParent()).isNull();
	}

	@Test
	void should_return_null_view_by_default() {
		assertThat(element.getView()).isNull();
	}

	@Test
	void should_set_and_get_tags() {
		element.setTags("tag1,tag2");
		assertThat(element.getTags()).isEqualTo("tag1,tag2");
	}

	@Test
	void should_return_false_for_ignored_by_default() {
		assertThat(element.isIgnored()).isFalse();
	}

	@Test
	void should_set_and_get_ignored() {
		element.setIgnored(true);
		assertThat(element.isIgnored()).isTrue();
	}

	@Test
	void should_return_null_userData_by_default() {
		assertThat(element.getUserData()).isNull();
	}

	@Test
	void should_set_and_get_userData() {
		Object data = "testData";
		element.setUserData(data);
		assertThat(element.getUserData()).isEqualTo(data);
	}

	@Test
	void should_return_null_metaData_by_default() {
		assertThat(element.getMetaData()).isNull();
	}

	@Test
	void should_set_and_get_metaData() {
		Map<String, Object> metaData = new HashMap<>();
		metaData.put("key", "value");
		element.setMetaData(metaData);
		assertThat(element.getMetaData()).containsEntry("key", "value");
	}

	@Test
	void should_return_null_innerElements_by_default() {
		assertThat(element.getInnerElements()).isNull();
	}

	@Test
	void should_register_inner_element() {
		TestViewElement child = new TestViewElement();
		element.registerInnerElement(child);
		assertThat(element.getInnerElements()).contains(child);
	}

	@Test
	void should_unregister_inner_element() {
		TestViewElement child = new TestViewElement();
		element.registerInnerElement(child);
		element.unregisterInnerElement(child);
		assertThat(element.getInnerElements()).doesNotContain(child);
	}

	@Test
	void should_not_throw_when_unregister_from_empty_inner_elements() {
		TestViewElement child = new TestViewElement();
		element.unregisterInnerElement(child);
		assertThat(element.getInnerElements()).isNull();
	}

	private static class TestViewElement extends AbstractViewElement {
	}

	/** Minimal concrete View stub - only used as a non-null reference */
	private static class DummyView extends View {
		DummyView() {
			super(null);
		}
	}
}
