package com.bstek.dorado.data.variant;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.data.entity.EnhanceableEntity;
import com.bstek.dorado.data.entity.EntityEnhancer;
import com.bstek.dorado.data.type.EntityDataType;

/**
 * 元数据对象。
 *
 */
public class MetaData extends HashMap<String, Object> implements VariantSet, EnhanceableEntity {

	private static final long serialVersionUID = -5206947024602715722L;

	private static final Log logger = LogFactory.getLog(MetaData.class);

	private static VariantConvertor variantConvertor;

	private EntityEnhancer entityEnhancer;

	public MetaData() {
	}

	public MetaData(Map<String, ?> map) {
		super(map);
	}

	private static VariantConvertor getVariantConvertor() {
		try {
			variantConvertor = VariantUtils.getVariantConvertor();
		}
		catch (Exception e) {
			logger.error(e, e);
		}
		return variantConvertor;
	}

	@Override
	public EntityEnhancer getEntityEnhancer() {
		return entityEnhancer;
	}

	@Override
	public void setEntityEnhancer(EntityEnhancer entityEnhancer) {
		this.entityEnhancer = entityEnhancer;
	}

	@Override
	public Object internalReadProperty(String property) throws Exception {
		return super.get(property);
	}

	@Override
	public void internalWriteProperty(String property, Object value) throws Exception {
		super.put(property, value);
	}

	@Override
	public Object get(Object key) {
		if (entityEnhancer != null) {
			Object result = null;
			try {
				result = entityEnhancer.readProperty(this, (String) key, false);
			}
			catch (Throwable e) {
				logger.warn(e, e);
			}
			return result;
		}
		else {
			return super.get(key);
		}
	}

	@Override
	public Object put(String key, Object value) {
		if (entityEnhancer != null) {
			Object result = super.get(key);
			try {
				entityEnhancer.writeProperty(this, key, value);
			}
			catch (Throwable e) {
				logger.warn(e, e);
			}
			return result;
		}
		else {
			return super.put(key, value);
		}
	}

	@Override
	public int size() {
		if (entityEnhancer != null) {
			Map<String, Object> exProperties = entityEnhancer.getExProperties();
			if (exProperties != null) {
				return super.size() + exProperties.size();
			}
		}
		return super.size();
	}

	@Override
	public boolean isEmpty() {
		boolean isEmpty = super.isEmpty();
		if (!isEmpty) {
			return false;
		}

		if (entityEnhancer != null) {
			Map<String, Object> exProperties = entityEnhancer.getExProperties();
			if (exProperties != null) {
				return exProperties.isEmpty();
			}
		}
		return true;
	}

	@Override
	public boolean containsKey(Object key) {
		boolean contains = super.containsKey(key);
		if (contains) {
			return true;
		}

		if (entityEnhancer != null) {
			Map<String, Object> exProperties = entityEnhancer.getExProperties();
			if (exProperties != null) {
				return exProperties.containsKey(key);
			}
		}
		return false;
	}

	@Override
	public Object remove(Object key) {
		if (entityEnhancer != null) {
			Map<String, Object> exProperties = entityEnhancer.getExProperties();
			if (exProperties != null && exProperties.containsKey(key)) {
				Object result = null;
				try {
					result = entityEnhancer.readProperty(this, (String) key, false);
				}
				catch (Throwable e) {
					logger.warn(e, e);
				}
				exProperties.remove(key);
				return result;
			}
			else {
				Object result = null;
				try {
					result = entityEnhancer.readProperty(this, (String) key, false);
				}
				catch (Throwable e) {
					logger.warn(e, e);
				}
				this.put((String) key, null);
				return result;
			}
		}
		else {
			return super.remove(key);
		}
	}

	@Override
	public void clear() {
		if (entityEnhancer != null) {
			EntityDataType dataType = entityEnhancer.getDataType();
			if (dataType != null && !dataType.getPropertyDefs().isEmpty()) {
				for (String property : dataType.getPropertyDefs().keySet()) {
					remove(property);
				}
			}

			Map<String, Object> exProperties = entityEnhancer.getExProperties();
			if (exProperties != null) {
				exProperties.clear();
			}
		}
		else {
			super.clear();
		}
	}

	@Override
	public boolean containsValue(Object value) {
		if (entityEnhancer != null) {
			for (Entry<String, Object> entry : doGetEntrySet()) {
				if (Objects.equals(value, entry.getValue())) {
					return true;
				}
			}
			return false;
		}
		else {
			return super.containsValue(value);
		}
	}

	@Override
	public Object clone() {
		if (entityEnhancer != null) {
			MetaData cloned = new MetaData();
			for (Entry<String, Object> entry : doGetEntrySet()) {
				cloned.put(entry.getKey(), entry.getValue());
			}
			return cloned;
		}
		else {
			return super.clone();
		}
	}

	@Override
	public Set<String> keySet() {
		if (entityEnhancer != null) {
			Map<String, Object> exProperties = entityEnhancer.getExProperties();
			if (exProperties != null) {
				Set<String> keySet = new HashSet<>(super.keySet());
				keySet.addAll(exProperties.keySet());
				return keySet;
			}
			else {
				return super.keySet();
			}
		}
		else {
			return super.keySet();
		}
	}

	@Override
	public Collection<Object> values() {
		List<Object> values = new ArrayList<>();
		for (Entry<String, Object> entry : doGetEntrySet()) {
			values.add(entry.getValue());
		}
		return values;
	}

	@Override
	public Set<Entry<String, Object>> entrySet() {
		if (entityEnhancer != null) {
			return doGetEntrySet();
		}
		else {
			return super.entrySet();
		}
	}

	protected Set<Entry<String, Object>> doGetEntrySet() {
		Set<Entry<String, Object>> entrySet = new HashSet<>();
		for (String property : keySet()) {
			MapEntry entry = new MapEntry(this, property);
			entrySet.add(entry);
		}
		return Collections.unmodifiableSet(entrySet);
	}

	@Override
	public String getString(String key) {
		return getVariantConvertor().toString(super.get(key));
	}

	@Override
	public void setString(String key, String s) {
		put(key, s);
	}

	@Override
	public boolean getBoolean(String key) {
		return getVariantConvertor().toBoolean(super.get(key));
	}

	@Override
	public void setBoolean(String key, boolean b) {
		put(key, Boolean.valueOf(b));
	}

	@Override
	public int getInt(String key) {
		return getVariantConvertor().toInt(super.get(key));
	}

	@Override
	public void setInt(String key, int i) {
		put(key, i);
	}

	@Override
	public long getLong(String key) {
		return getVariantConvertor().toLong(super.get(key));
	}

	@Override
	public void setLong(String key, long l) {
		put(key, l);
	}

	@Override
	public float getFloat(String key) {
		return getVariantConvertor().toFloat(super.get(key));
	}

	@Override
	public void setFloat(String key, float f) {
		put(key, f);
	}

	@Override
	public double getDouble(String key) {
		return getVariantConvertor().toDouble(super.get(key));
	}

	@Override
	public void setDouble(String key, double d) {
		put(key, d);
	}

	@Override
	public BigDecimal getBigDecimal(String key) {
		return getVariantConvertor().toBigDecimal(super.get(key));
	}

	@Override
	public void setBigDecimal(String key, BigDecimal bd) {
		put(key, bd);
	}

	@Override
	public Date getDate(String key) {
		return getVariantConvertor().toDate(super.get(key));
	}

	@Override
	public void setDate(String key, Date date) {
		put(key, date);
	}

	@Override
	public Object get(String key) {
		return super.get(key);
	}

	@Override
	public void set(String key, Object value) {
		put(key, value);
	}

	@Override
	public Map<String, Object> toMap() {
		return this;
	}

}

class MapEntry implements Map.Entry<String, Object> {

	private MetaData metaData;

	private String key;

	public MapEntry(MetaData metaData, String key) {
		this.metaData = metaData;
		this.key = key;
	}

	@Override
	public String getKey() {
		return key;
	}

	@Override
	public Object getValue() {
		return metaData.get(key);
	}

	@Override
	public Object setValue(Object value) {
		return metaData.put(key, value);
	}

}
