package com.bstek.dorado.util.proxy;

import java.util.HashMap;
import java.util.Map;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;

public class BeanExtenderMethodInterceptor implements MethodInterceptor {

	private Map<String, Object> userDataMap;

	@Override
	public Object invoke(MethodInvocation methodInvocation) throws Throwable {
		return methodInvocation.proceed();
	}

	/**
	 * @param key
	 * @param data
	 */
	public void setUserData(String key, Object data) {
		if (userDataMap == null) {
			userDataMap = new HashMap<>();
		}
		userDataMap.put(key, data);
	}

	/**
	 * @param key
	 * @return
	 */
	public Object getUserData(String key) {
		return (userDataMap == null) ? null : userDataMap.get(key);
	}

}
