package com.bstek.dorado.util.proxy;

import java.util.Objects;

import org.aopalliance.intercept.MethodInterceptor;

public abstract class BeanExtender {

	/**
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	public static Object wrapBean(Object bean) throws Exception {
		Objects.requireNonNull(bean);
		return setExProperty(bean, null, null);
	}

	public static boolean hasExtended(Object bean) {
		return getBeanExtenderMethodInterceptor(bean) != null;
	}

	private static BeanExtenderMethodInterceptor getBeanExtenderMethodInterceptor(Object bean) {
		BeanExtenderMethodInterceptor bemi = null;
		MethodInterceptorDispatcher dispatcher = ProxyBeanUtils.getMethodInterceptorDispatcher(bean);
		if (dispatcher != null) {
			MethodInterceptor[] mis = dispatcher.getSubMethodInterceptors();
			for (MethodInterceptor mi : mis) {
				if (mi instanceof BeanExtenderMethodInterceptor) {
					bemi = (BeanExtenderMethodInterceptor) mi;
					break;
				}
			}
		}
		return bemi;
	}

	private static Object doSetExProperty(Object bean, String key, Object data) throws Exception {
		BeanExtenderMethodInterceptor bemi = null;
		MethodInterceptorDispatcher dispatcher = ProxyBeanUtils.getMethodInterceptorDispatcher(bean);
		if (dispatcher == null) {
			bemi = new BeanExtenderMethodInterceptor();
			bean = ProxyBeanUtils.proxyBean(bean, bemi);
		}
		else {
			MethodInterceptor[] mis = dispatcher.getSubMethodInterceptors();
			for (MethodInterceptor mi : mis) {
				if (mi instanceof BeanExtenderMethodInterceptor) {
					bemi = (BeanExtenderMethodInterceptor) mi;
					break;
				}
			}
			if (bemi == null) {
				MethodInterceptor[] newMis = new MethodInterceptor[mis.length + 1];
				System.arraycopy(mis, 0, newMis, 0, mis.length);
				bemi = new BeanExtenderMethodInterceptor();
				newMis[mis.length] = bemi;
				dispatcher.setSubMethodInterceptors(newMis);
			}
		}
		if (key != null) {
			bemi.setUserData(key, data);
		}
		return bean;
	}

	/**
	 * @param bean
	 * @param key
	 * @param data
	 * @return
	 * @throws Exception
	 */
	public static Object setExProperty(Object bean, String key, Object data) throws Exception {
		Objects.requireNonNull(key);
		return doSetExProperty(bean, key, data);
	}

	/**
	 * @param bean
	 * @param key
	 * @return
	 */
	public static Object getExProperty(Object bean, String key) {
		Objects.requireNonNull(bean);
		Objects.requireNonNull(key);

		BeanExtenderMethodInterceptor bemi = getBeanExtenderMethodInterceptor(bean);
		if (bemi != null) {
			return bemi.getUserData(key);
		}
		else {
			return null;
		}
	}

}
