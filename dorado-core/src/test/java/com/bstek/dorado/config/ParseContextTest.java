package com.bstek.dorado.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;
import java.io.InputStream;
import java.net.URL;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bstek.dorado.core.io.Resource;

class ParseContextTest {

	/**
	 * Simple Resource implementation for testing.
	 */
	private static class TestResource implements Resource {
		private final String path;

		TestResource(String path) {
			this.path = path;
		}

		@Override
		public String getPath() {
			return path;
		}

		@Override
		public boolean exists() {
			return false;
		}

		@Override
		public long getTimestamp() {
			return 0;
		}

		@Override
		public InputStream getInputStream() {
			return null;
		}

		@Override
		public URL getURL() {
			return null;
		}

		@Override
		public File getFile() {
			return null;
		}

		@Override
		public Resource createRelative(String relativePath) {
			return null;
		}

		@Override
		public String getFilename() {
			return path;
		}

		@Override
		public String getDescription() {
			return "TestResource[" + path + "]";
		}
	}

	private ParseContext context;

	@BeforeEach
	void setUp() {
		context = new ParseContext();
	}

	@Test
	void should_have_null_resource_initially() {
		assertThat(context.getResource()).isNull();
	}

	@Test
	void should_set_and_get_resource() {
		Resource resource = new TestResource("test.xml");
		context.setResource(resource);

		assertThat(context.getResource()).isSameAs(resource);
	}

	@Test
	void should_have_empty_dependent_resources_initially() {
		assertThat(context.getDependentResources()).isEmpty();
	}

	@Test
	void should_allow_adding_dependent_resources() {
		Resource resource1 = new TestResource("dep1.xml");
		Resource resource2 = new TestResource("dep2.xml");

		context.getDependentResources().add(resource1);
		context.getDependentResources().add(resource2);

		assertThat(context.getDependentResources()).hasSize(2).contains(resource1, resource2);
	}

	@Test
	void should_have_empty_attributes_initially() {
		assertThat(context.getAttributes()).isEmpty();
	}

	@Test
	void should_allow_setting_attributes() {
		context.getAttributes().put("key1", "value1");
		context.getAttributes().put("key2", 42);

		assertThat(context.getAttributes()).hasSize(2);
		assertThat(context.getAttributes().get("key1")).isEqualTo("value1");
		assertThat(context.getAttributes().get("key2")).isEqualTo(42);
	}

	@Test
	void should_return_same_dependent_resources_set() {
		assertThat(context.getDependentResources()).isSameAs(context.getDependentResources());
	}

	@Test
	void should_return_same_attributes_map() {
		assertThat(context.getAttributes()).isSameAs(context.getAttributes());
	}
}
