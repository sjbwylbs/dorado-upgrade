package com.bstek.dorado.data.type.manager;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

public class DataTypeTypeRegistry {

	private Map<String, DataTypeTypeRegisterInfo> typeMap = new LinkedHashMap<>();

	private String defaultType;

	public void setDefaultType(String defaultType) {
		this.defaultType = defaultType;
	}

	public String getDefaultType() {
		return defaultType;
	}

	public void registerType(DataTypeTypeRegisterInfo registryInfo) {
		typeMap.put(registryInfo.getType(), registryInfo);
	}

	public DataTypeTypeRegisterInfo getTypeRegistryInfo(String type) {
		if (StringUtils.isEmpty(type)) {
			type = defaultType;
		}
		return typeMap.get(type);
	}

	public Collection<DataTypeTypeRegisterInfo> getTypes() {
		return typeMap.values();
	}

}
