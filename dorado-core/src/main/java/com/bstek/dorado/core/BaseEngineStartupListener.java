package com.bstek.dorado.core;

import com.bstek.dorado.util.proxy.ProxyBeanUtils;

public class BaseEngineStartupListener extends EngineStartupListener {

	@Override
	public void onStartup() throws Exception {
		String byteCodeProvider = Configure.getString("core.defaultByteCodeProvider");
		if ("cglib".equalsIgnoreCase(byteCodeProvider)) {
			ProxyBeanUtils.setDefaultByteCodeProvider(ProxyBeanUtils.CGLIB);
		}
		else {
			ProxyBeanUtils.setDefaultByteCodeProvider(ProxyBeanUtils.JAVASSIST);
		}

	}

}
