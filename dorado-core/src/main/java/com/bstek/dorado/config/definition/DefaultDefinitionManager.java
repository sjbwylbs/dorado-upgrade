package com.bstek.dorado.config.definition;

import java.util.Hashtable;
import java.util.Map;

/**
 * 默认的配置声明对象管理器。
 *
 */
public class DefaultDefinitionManager<T extends Definition> implements DefinitionManager<T> {

	private Map<String, T> definitions = new Hashtable<>();

	private DefinitionManager<T> parent;

	public DefaultDefinitionManager() {
	}

	public DefaultDefinitionManager(DefinitionManager<T> parent) {
		this.parent = parent;
	}

	public DefinitionManager<T> getParent() {
		return parent;
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public synchronized void registerDefinition(String name, T definition) {
		if (definition instanceof DefinitionManagerAware) {
			((DefinitionManagerAware) definition).setDefinitionManager(this);
		}
		definitions.put(name, definition);
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public synchronized T unregisterDefinition(String name) {
		T definition = definitions.remove(name);
		if (definition instanceof DefinitionManagerAware) {
			((DefinitionManagerAware) definition).setDefinitionManager(this);
		}
		return definition;
	}

	@Override
	public synchronized T getDefinition(String name) {
		T definition = definitions.get(name);
		if (definition == null && parent != null) {
			definition = parent.getDefinition(name);
		}
		return definition;
	}

	@Override
	public Map<String, T> getDefinitions() {
		return definitions;
	}

	public boolean hasOwnDefintion(String name) {
		return definitions.containsKey(name);
	}

	@Override
	public synchronized void clearAllDefinitions() {
		definitions.clear();
	}

}
