package com.bstek.dorado.data.type.validator;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

public class DefaultValidatorTypeRegistry implements ValidatorTypeRegistry {

	private Map<String, ValidatorTypeRegisterInfo> typeMap = new LinkedHashMap<>();

	@Override
	public void registerType(ValidatorTypeRegisterInfo registryInfo) {
		typeMap.put(registryInfo.getType(), registryInfo);
	}

	@Override
	public ValidatorTypeRegisterInfo getTypeRegisterInfo(String type) {
		return typeMap.get(type);
	}

	@Override
	public Collection<ValidatorTypeRegisterInfo> getTypes() {
		return typeMap.values();
	}

}
