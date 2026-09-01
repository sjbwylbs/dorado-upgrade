package com.bstek.dorado.web.resolver;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class ResourceTypeManager {

	private final Map<String, ResourceType> resourceTypeMap = new HashMap<>();

	public void registerResourceType(ResourceType resourceType) {
		String type = resourceType.getType();
		Objects.requireNonNull(type);
		resourceTypeMap.put(type.toLowerCase(), resourceType);
	}

	public ResourceType getResourceType(String type) {
		return resourceTypeMap.get(type.toLowerCase());
	}

}
