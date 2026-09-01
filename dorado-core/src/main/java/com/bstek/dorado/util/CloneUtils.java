package com.bstek.dorado.util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import com.bstek.dorado.console.Logger;

/**
 * 用于辅助实现对象克隆的工具类。
 *
 */

public abstract class CloneUtils {

	private static final String CLONE_METHOD = "clone";

	private static final Class<?>[] CLONE_METHOD_ARGTYPES = new Class<?>[] {};

	private static final Object[] CLONE_METHOD_ARGS = new Object[] {};

	private static final Logger log = Logger.getLog(CloneUtils.class);

	/**
	 * 克隆对象。
	 * @param object 被克隆的对象
	 * @return 克隆的对象
	 * @throws CloneNotSupportedException
	 */
	@SuppressWarnings("unchecked")
	public static <T> T clone(T object) throws CloneNotSupportedException {
		T clonedObject = null;
		Class<?> cl = object.getClass();
		Method method = null;
		try {
			do {
				try {
					method = cl.getDeclaredMethod(CLONE_METHOD, CLONE_METHOD_ARGTYPES);
					boolean methodAccessible = method.canAccess(object);
					if (!methodAccessible) {
						method.setAccessible(true);
					}
					try {
						clonedObject = (T) method.invoke(object, CLONE_METHOD_ARGS);
					}
					finally {
						if (!methodAccessible) {
							method.setAccessible(false);
						}
					}

				}
				catch (NoSuchMethodException e) {
					cl = cl.getSuperclass();
				}
			}
			while (method == null);

		}
		catch (SecurityException | IllegalArgumentException | IllegalAccessException e) {
			log.error(e.getMessage(), e);
		}
		catch (InvocationTargetException e) {
			log.error(e.getCause().getMessage(), e.getCause());
		}
		return clonedObject;
	}

}
