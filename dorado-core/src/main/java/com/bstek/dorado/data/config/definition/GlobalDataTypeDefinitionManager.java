package com.bstek.dorado.data.config.definition;

public class GlobalDataTypeDefinitionManager extends DataTypeDefinitionManager {

	@Override
	public void registerDefinition(String name, DataTypeDefinition definition) {
		DataObjectDefinitionUtils.setDataTypeGlobal(definition, true);
		super.registerDefinition(name, definition);
	}

	@Override
	public DataTypeDefinition unregisterDefinition(String name) {
		DataTypeDefinition definition = super.unregisterDefinition(name);
		if (definition != null) {
			DataObjectDefinitionUtils.setDataTypeGlobal(definition, false);
		}
		return definition;
	}

}
