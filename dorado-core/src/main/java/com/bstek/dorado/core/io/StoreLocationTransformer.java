package com.bstek.dorado.core.io;

import com.bstek.dorado.core.Configure;

public class StoreLocationTransformer implements LocationTransformer {

	@Override
	public String transform(String protocal, String location) {
		return ResourceUtils.concatPath(Configure.getString("core.storeDir"), location.substring(protocal.length()));
	}

}
