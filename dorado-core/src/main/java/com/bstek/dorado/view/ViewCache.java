package com.bstek.dorado.view;

public class ViewCache {

	private ViewCacheMode mode = ViewCacheMode.none;

	private long maxAge;

	public ViewCacheMode getMode() {
		return mode;
	}

	public void setMode(ViewCacheMode mode) {
		this.mode = mode;
	}

	public long getMaxAge() {
		return maxAge;
	}

	public void setMaxAge(long maxAge) {
		this.maxAge = maxAge;
	}

}
