package com.bstek.dorado.data.type.property;

import com.bstek.dorado.annotation.ClientProperty;

public abstract class LazyPropertyDef extends PropertyDefSupport {

	private boolean activeAtClient = true;

	private CacheMode cacheMode = CacheMode.bothSides;

	@ClientProperty(escapeValue = "true")
	public boolean isActiveAtClient() {
		return activeAtClient;
	}

	public void setActiveAtClient(boolean activeAtClient) {
		this.activeAtClient = activeAtClient;
	}

	@ClientProperty(ignored = true)
	public CacheMode getCacheMode() {
		return cacheMode;
	}

	public void setCacheMode(CacheMode cacheMode) {
		this.cacheMode = cacheMode;
	}

}
