package com.bstek.dorado.data.entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.bstek.dorado.data.type.AggregationDataType;
import com.bstek.dorado.data.type.CustomEntityDataType;
import com.bstek.dorado.data.type.DataType;
import com.bstek.dorado.data.type.GenericCustomEntityDataType;
import com.bstek.dorado.data.type.property.PropertyDef;

/**
 * @param <K>
 */
@SuppressWarnings("rawtypes")
public class GenericCustomEntityAdapter implements Map<String, Object> {

	protected Object target;

	protected GenericCustomEntityDataType genericDataObjectDataType;

	public GenericCustomEntityAdapter(Object target, GenericCustomEntityDataType genericDataObjectDataType) {
		assert (target != null);

		this.target = target;
		this.genericDataObjectDataType = genericDataObjectDataType;
	}

	public Object getTarget() {
		return target;
	}

	public GenericCustomEntityDataType getGenericDataObjectDataType() {
		return genericDataObjectDataType;
	}

	@SuppressWarnings("unchecked")
	protected Set<String> getPropertySet() {
		return genericDataObjectDataType.getPropertySet();
	}

	@SuppressWarnings("unchecked")
	protected Object readProperty(String property) {
		DataType dataType = null;
		PropertyDef propertyDef = genericDataObjectDataType.getPropertyDef(property);
		if (propertyDef != null) {
			dataType = propertyDef.getDataType();
		}

		try {
			Object value = genericDataObjectDataType.readProperty(target, property);
			if (value != null && dataType != null) {
				if (dataType instanceof CustomEntityDataType) {
					value = ((CustomEntityDataType) dataType).toMap(value);
				}
				else if ((dataType instanceof AggregationDataType)) {
					AggregationDataType aggregationDataType = (AggregationDataType) dataType;
					DataType elementDataType = ((AggregationDataType) dataType).getElementDataType();
					if (elementDataType != null && elementDataType instanceof CustomEntityDataType) {
						CustomEntityDataType customEntityDataType = (CustomEntityDataType) elementDataType;

						Class<?> creationType = aggregationDataType.getCreationType();
						if (creationType == null) {
							creationType = aggregationDataType.getMatchType();
						}

						Collection newCollection = (Collection) creationType.getDeclaredConstructor().newInstance();
						for (Object element : (Collection) value) {
							newCollection.add(customEntityDataType.toMap(element));
						}
						value = newCollection;
					}
				}
				else {
					value = dataType.fromObject(value);
				}
			}
			return value;
		}
		catch (Exception e) {
			throw new CustomEntityMapException(e);
		}
	}

	@SuppressWarnings("unchecked")
	protected void writeProperty(String property, Object value) {
		try {
			genericDataObjectDataType.writeProperty(target, property, value);
		}
		catch (Exception e) {
			throw new CustomEntityMapException(e);
		}
	}

	@Override
	public int size() {
		return getPropertySet().size();
	}

	@Override
	public boolean isEmpty() {
		return getPropertySet().isEmpty();
	}

	@Override
	public boolean containsKey(Object key) {
		return getPropertySet().contains(key);
	}

	@Override
	public boolean containsValue(Object value) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Object get(Object key) {
		return readProperty((String) key);
	}

	@Override
	public Object put(String key, Object value) {
		writeProperty(key, value);
		return value;
	}

	@Override
	public Object remove(Object key) {
		Object oldValue = readProperty((String) key);
		writeProperty((String) key, null);
		return oldValue;
	}

	@Override
	public void putAll(Map<? extends String, ? extends Object> m) {
		for (Map.Entry<? extends String, ? extends Object> entry : m.entrySet()) {
			writeProperty(entry.getKey(), entry.getValue());
		}
	}

	@Override
	public void clear() {
		for (String property : getPropertySet()) {
			writeProperty(property, null);
		}
	}

	@Override
	public Set<String> keySet() {
		return getPropertySet();
	}

	@Override
	public Collection<Object> values() {
		Collection<Object> values = new ArrayList<>();
		for (String property : getPropertySet()) {
			values.add(readProperty(property));
		}
		return values;
	}

	@Override
	public Set<Map.Entry<String, Object>> entrySet() {
		Set<Map.Entry<String, Object>> entrySet = new HashSet<>();
		for (String property : getPropertySet()) {
			entrySet.add(new MapEntry(this, property));
		}
		return entrySet;
	}

}

class MapEntry implements Map.Entry<String, Object> {

	private Map<String, Object> map;

	private String key;

	public MapEntry(Map<String, Object> map, String key) {
		this.map = map;
		this.key = key;
	}

	@Override
	public String getKey() {
		return key;
	}

	@Override
	public Object getValue() {
		return map.get(key);
	}

	@Override
	public Object setValue(Object value) {
		return map.put(key, value);
	}

}
