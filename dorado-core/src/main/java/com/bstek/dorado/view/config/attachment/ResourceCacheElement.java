package com.bstek.dorado.view.config.attachment;

import java.io.Serializable;

import com.bstek.dorado.core.io.RefreshableResource;

public class ResourceCacheElement implements Serializable {

	private static final long serialVersionUID = -4363610522391395305L;

	private RefreshableResource resource;
	private Object value;

	public ResourceCacheElement(RefreshableResource resource, Object value) {
		this.resource = resource;
		this.value = value;
	}

	public Object getObjectValue() {
		return value;
	}

	public Object getObjectKey() {
		return resource;
	}

	public boolean isExpired() {
		if (resource != null) {
			return !resource.isValid();
		}
		return false;
	}

}
