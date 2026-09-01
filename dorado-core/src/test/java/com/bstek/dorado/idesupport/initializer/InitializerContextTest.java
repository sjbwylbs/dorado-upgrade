package com.bstek.dorado.idesupport.initializer;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bstek.dorado.idesupport.RuleTemplateManager;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.view.output.Outputter;

class InitializerContextTest {

	private InitializerContext context;
	private RuleTemplateManager manager;

	@BeforeEach
	void setUp() {
		manager = new RuleTemplateManager();
		context = new InitializerContext(manager);
	}

	@Test
	void should_store_rule_template_manager() {
		assertThat(context.getRuleTemplateManager()).isSameAs(manager);
	}

	@Test
	void should_push_and_pop_type() {
		context.pushType(String.class);
		context.pushType(Integer.class);
		assertThat(context.popType()).isEqualTo(Integer.class);
		assertThat(context.popType()).isEqualTo(String.class);
	}

	@Test
	void should_return_current_type() {
		assertThat(context.getCurrentType()).isNull();
		context.pushType(String.class);
		assertThat(context.getCurrentType()).isEqualTo(String.class);
		context.pushType(Integer.class);
		assertThat(context.getCurrentType()).isEqualTo(Integer.class);
	}

	@Test
	void should_return_null_current_type_when_stack_empty() {
		assertThat(context.getCurrentType()).isNull();
	}

	@Test
	void should_push_and_pop_outputter() {
		Outputter outputter1 = new DummyOutputter();
		Outputter outputter2 = new DummyOutputter();
		context.pushOutputter(outputter1);
		context.pushOutputter(outputter2);
		assertThat(context.popOutputter()).isSameAs(outputter2);
		assertThat(context.popOutputter()).isSameAs(outputter1);
	}

	@Test
	void should_return_current_outputter() {
		assertThat(context.getCurrentOutputter()).isNull();
		Outputter outputter = new DummyOutputter();
		context.pushOutputter(outputter);
		assertThat(context.getCurrentOutputter()).isSameAs(outputter);
	}

	@Test
	void should_return_null_current_outputter_when_stack_empty() {
		assertThat(context.getCurrentOutputter()).isNull();
	}

	@Test
	void should_push_and_pop_property() {
		context.pushProperty("color");
		context.pushProperty("size");
		assertThat(context.popProperty()).isEqualTo("size");
		assertThat(context.popProperty()).isEqualTo("color");
	}

	@Test
	void should_return_current_property() {
		assertThat(context.getCurrentProperty()).isNull();
		context.pushProperty("color");
		assertThat(context.getCurrentProperty()).isEqualTo("color");
		context.pushProperty("size");
		assertThat(context.getCurrentProperty()).isEqualTo("size");
	}

	@Test
	void should_return_null_current_property_when_stack_empty() {
		assertThat(context.getCurrentProperty()).isNull();
	}

	@Test
	void should_have_empty_type_annotation_info_map() {
		assertThat(context.getTypeAnnotationInfoMap()).isEmpty();
	}

	@Test
	void should_have_empty_child_template_map() {
		assertThat(context.getChildTemplateMap()).isEmpty();
	}

	/**
	 * Simple dummy Outputter implementation for testing purposes.
	 */
	private static class DummyOutputter implements Outputter {
		@Override
		public void output(Object object, OutputContext context) throws Exception {
			// no-op for testing
		}
	}
}
