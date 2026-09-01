package com.bstek.dorado.console.parser;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class NodeTest {

	private Node node;

	@BeforeEach
	void setUp() {
		node = new Node();
	}

	@Test
	void should_create_empty_node_with_default_constructor() {
		assertThat(node.getName()).isNull();
		assertThat(node.getParser()).isNull();
		assertThat(node.getComponent()).isNull();
		assertThat(node.getProperties()).isEmpty();
		assertThat(node.getChildren()).isEmpty();
	}

	@Test
	void should_create_node_with_name_constructor() {
		Node namedNode = new Node("testNode");
		assertThat(namedNode.getName()).isEqualTo("testNode");
	}

	@Test
	void should_set_and_get_component() {
		node.setComponent("com.example.Component");
		assertThat(node.getComponent()).isEqualTo("com.example.Component");
	}

	@Test
	void should_add_property() {
		node.addProperty("key1", "value1");
		assertThat(node.getProperties()).hasSize(1);
		assertThat(node.getProperties().get(0).getKey()).isEqualTo("key1");
		assertThat(node.getProperties().get(0).getValue()).isEqualTo("value1");
	}

	@Test
	void should_add_multiple_properties() {
		node.addProperty("key1", "value1");
		node.addProperty("key2", "value2");
		assertThat(node.getProperties()).hasSize(2);
	}

	@Test
	void should_set_and_get_children() {
		Node child = new Node("child");
		node.getChildren().add(child);
		assertThat(node.getChildren()).hasSize(1);
		assertThat(node.getChildren().get(0).getName()).isEqualTo("child");
	}

	@Test
	void should_create_keyValue_with_constructor() {
		Node.KeyValue kv = new Node.KeyValue("myKey", "myValue");
		assertThat(kv.getKey()).isEqualTo("myKey");
		assertThat(kv.getValue()).isEqualTo("myValue");
	}

	@Test
	void should_set_and_get_keyValue_properties() {
		Node.KeyValue kv = new Node.KeyValue();
		kv.setKey("newKey");
		kv.setValue("newValue");
		assertThat(kv.getKey()).isEqualTo("newKey");
		assertThat(kv.getValue()).isEqualTo("newValue");
	}
}
