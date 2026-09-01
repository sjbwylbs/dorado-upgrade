package com.bstek.dorado.data.config.definition;

import java.util.Collection;
import java.util.List;

import com.bstek.dorado.config.definition.CreationContext;
import com.bstek.dorado.config.definition.Definition;
import com.bstek.dorado.config.definition.DefinitionUtils;

public class EntityCollectionDefinition extends Definition {

	private Class<?> collectionType;

	private List<Object> entities;

	public void setCollectionType(Class<?> collectionType) {
		this.collectionType = collectionType;
	}

	public Class<?> getCollectionType() {
		return collectionType;
	}

	public List<Object> getEntities() {
		return entities;
	}

	public void setEntities(List<Object> entities) {
		this.entities = entities;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	protected Object doCreate(CreationContext context, Object[] constuctorArgs) throws Exception {
		Collection collection = (Collection) collectionType.getDeclaredConstructor().newInstance();
		for (Object entity : entities) {
			collection.add(DefinitionUtils.getRealValue(entity, context));
		}
		return collection;
	}

}
