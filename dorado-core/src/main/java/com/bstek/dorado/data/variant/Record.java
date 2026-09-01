package com.bstek.dorado.data.variant;

import java.util.Map;

import com.bstek.dorado.data.entity.EntityState;
import com.bstek.dorado.data.type.DataType;

/**
 * 记录对象。
 *
 */
public class Record extends MetaData {

	private static final long serialVersionUID = 4038526280395571125L;

	public Record() {
	}

	public Record(Map<String, ?> map) {
		super(map);
	}

	public DataType getDataType() {
		return getEntityEnhancer().getDataType();
	}

	public EntityState getState() {
		return getEntityEnhancer().getState();
	}

	public void setState(EntityState state) {
		getEntityEnhancer().setState(state);
	}

	public Map<String, Object> getOldValues() {
		return getEntityEnhancer().getOldValues();
	}

}
