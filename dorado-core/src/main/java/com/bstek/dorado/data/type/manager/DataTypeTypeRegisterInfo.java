package com.bstek.dorado.data.type.manager;

import com.bstek.dorado.data.type.DataType;

public class DataTypeTypeRegisterInfo {

	private String type;

	private Class<? extends DataType> classType;

	public DataTypeTypeRegisterInfo(String type, Class<? extends DataType> classType) {
		this.type = type;
		this.classType = classType;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Class<? extends DataType> getClassType() {
		return classType;
	}

	public void setClassType(Class<? extends DataType> classType) {
		this.classType = classType;
	}

}
