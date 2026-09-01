package com.bstek.dorado.data.type.property;

public enum CacheMode {

	noCache, serverSide, clientSide, bothSides;

	public static boolean isCacheableAtServerSide(CacheMode cacheMode) {
		return cacheMode == bothSides || cacheMode == serverSide;
	}

	public static boolean isCacheableAtClientSide(CacheMode cacheMode) {
		return cacheMode == bothSides || cacheMode == clientSide;
	}

}
