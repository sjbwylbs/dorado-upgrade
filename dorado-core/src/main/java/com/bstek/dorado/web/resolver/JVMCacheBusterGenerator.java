package com.bstek.dorado.web.resolver;

import org.apache.commons.lang3.StringUtils;

public class JVMCacheBusterGenerator implements CacheBusterGenerator {

	private static final String TIMESTAMP = System.currentTimeMillis() + "";

	@Override
	public String getCacheBuster(String param) throws Exception {
		return (StringUtils.isEmpty(param)) ? TIMESTAMP : (param + TIMESTAMP);
	}

}
