package com.bstek.dorado.data.resolver;

import java.lang.reflect.Method;

import org.aopalliance.intercept.MethodInvocation;

import com.bstek.dorado.common.proxy.PatternMethodInterceptor;

public abstract class AbstractDataResolverMethodInterceptor extends PatternMethodInterceptor {

	public static final String METHOD_NAME = "resolve";

	@Override
	public final Object invoke(MethodInvocation methodInvocation) throws Throwable {
		DataResolver dataResolver = (DataResolver) methodInvocation.getThis();
		Method method = methodInvocation.getMethod();
		String methodName = method.getName();

		if (method.getReturnType().equals(Object.class) && methodName.equals(METHOD_NAME)) {
			Object[] arguments = methodInvocation.getArguments();
			DataItems dataItems = null;
			Object parameter = null;

			if (arguments.length == 1) {
				dataItems = (DataItems) arguments[0];
			}
			else if (arguments.length == 2) {
				dataItems = (DataItems) arguments[0];
				parameter = arguments[1];
			}

			return invokeResolve(methodInvocation, dataResolver, dataItems, parameter);
		}

		return methodInvocation.proceed();
	}

	protected abstract Object invokeResolve(MethodInvocation methodInvocation, DataResolver dataResolver,
			DataItems dataItems, Object parameter) throws Throwable;

}
