package com.bstek.dorado.view;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ViewElementUtilsTest {

	@Test
	void should_return_view_when_parent_is_view() {
		DummyView dummyView = new DummyView();
		View result = ViewElementUtils.getParentView(dummyView);
		assertThat(result).isSameAs(dummyView);
	}

	@Test
	void should_return_view_from_element_when_parent_is_not_view() {
		DummyView dummyView = new DummyView();
		TestViewElement element = new TestViewElement();
		element.setViewRef(dummyView);
		View result = ViewElementUtils.getParentView(element);
		assertThat(result).isSameAs(dummyView);
	}

	@Test
	void should_do_nothing_when_clearParent_with_null_oldParent() {
		TestViewElement element = new TestViewElement();
		// Should not throw
		ViewElementUtils.clearParentViewElement(element, null);
	}

	@Test
	void should_unregister_from_view_when_clearing_parent() {
		DummyView dummyView = new DummyView();
		TestViewElement innerElement = new TestViewElement();
		innerElement.setId("inner1");
		dummyView.registerViewElement(innerElement);

		TestViewElement oldParent = new TestViewElement();
		oldParent.setViewRef(dummyView);
		oldParent.registerInnerElement(innerElement);

		ViewElementUtils.clearParentViewElement(innerElement, oldParent);
		assertThat(dummyView.getViewElement("inner1")).isNull();
	}

	@Test
	void should_register_to_view_when_setting_parent() {
		DummyView dummyView = new DummyView();
		TestViewElement parent = new TestViewElement();
		parent.setViewRef(dummyView);

		TestViewElement child = new TestViewElement();
		child.setId("child1");

		ViewElementUtils.setParentViewElement(child, parent);
		assertThat(dummyView.getViewElement("child1")).isSameAs(child);
	}

	@Test
	void should_register_recursive_inner_elements() {
		DummyView dummyView = new DummyView();
		TestViewElement parent = new TestViewElement();
		parent.setViewRef(dummyView);

		TestViewElement innerChild = new TestViewElement();
		innerChild.setId("innerChild1");

		TestViewElement element = new TestViewElement();
		element.setId("element1");
		element.registerInnerElement(innerChild);

		ViewElementUtils.setParentViewElement(element, parent);
		assertThat(dummyView.getViewElement("element1")).isSameAs(element);
		assertThat(dummyView.getViewElement("innerChild1")).isSameAs(innerChild);
	}

	/** Concrete ViewElement for testing */
	private static class TestViewElement extends AbstractViewElement {
		private View viewRef;

		void setViewRef(View view) {
			this.viewRef = view;
		}

		@Override
		public View getView() {
			return viewRef;
		}
	}

	/** Minimal concrete View stub */
	private static class DummyView extends View {
		DummyView() {
			super(null);
		}
	}
}
