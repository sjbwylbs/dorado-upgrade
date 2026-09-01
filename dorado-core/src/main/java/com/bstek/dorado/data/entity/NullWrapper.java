package com.bstek.dorado.data.entity;

import com.bstek.dorado.data.type.DataType;

public class NullWrapper {

	private DataType dataType;

	public NullWrapper(DataType dataType) {
		this.dataType = dataType;
	}

	public DataType getDataType() {
		return dataType;
	}

}
