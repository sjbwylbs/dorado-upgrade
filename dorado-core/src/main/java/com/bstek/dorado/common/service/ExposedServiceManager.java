package com.bstek.dorado.common.service;

import java.util.Collections;
import java.util.Hashtable;
import java.util.Map;

public class ExposedServiceManager {

	private Map<String, ExposedServiceDefintion> serviceMap = new Hashtable<>();

	public void registerService(ExposedServiceDefintion exposedService) {
		serviceMap.put(exposedService.getName(), exposedService);
	}

	public ExposedServiceDefintion getService(String name) {
		return serviceMap.get(name);
	}

	@SuppressWarnings("unchecked")
	public Map<String, ExposedServiceDefintion> getServices() {
		return Collections.unmodifiableMap(serviceMap);
	}

}
