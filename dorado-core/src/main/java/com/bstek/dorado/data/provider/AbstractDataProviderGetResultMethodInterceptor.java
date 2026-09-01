package com.bstek.dorado.data.provider;

import java.lang.reflect.Method;

import org.aopalliance.intercept.MethodInvocation;

import com.bstek.dorado.common.proxy.PatternMethodInterceptor;
import com.bstek.dorado.data.type.DataType;

public abstract class AbstractDataProviderGetResultMethodInterceptor extends PatternMethodInterceptor {

	public static final String METHOD_NAME = "getResult";

	public static final String PAGING_METHOD_NAME = "getPagingResult";

	@Override
	@SuppressWarnings("rawtypes")
	public final Object invoke(MethodInvocation methodInvocation) throws Throwable {
		DataProvider dataProvider = (DataProvider) methodInvocation.getThis();
		Method method = methodInvocation.getMethod();
		String methodName = method.getName();

		if (method.getReturnType().equals(Object.class)) {
			if (methodName.equals(METHOD_NAME)) {
				Object[] arguments = methodInvocation.getArguments();
				DataType resultDataType = null;
				Object parameter = null;

				if (arguments.length == 1) {
					parameter = arguments[0];
				}
				else if (arguments.length == 2) {
					parameter = arguments[0];
					resultDataType = (DataType) arguments[1];
				}

				if (resultDataType == null) {
					resultDataType = dataProvider.getResultDataType();
				}

				return invokeGetResult(methodInvocation, dataProvider, parameter, resultDataType);
			}
		}
		else if (method.getReturnType().equals(void.class)) {
			if (methodName.equals(PAGING_METHOD_NAME)) {
				Object[] arguments = methodInvocation.getArguments();
				DataType resultDataType = null;
				Object parameter = null;

				Page page = null;
				if (arguments.length == 1) {
					page = (Page) arguments[0];
				}
				else if (arguments.length == 2) {
					parameter = arguments[0];
					page = (Page) arguments[1];
				}
				else if (arguments.length == 3) {
					parameter = arguments[0];
					page = (Page) arguments[1];
					resultDataType = (DataType) arguments[2];
				}

				if (resultDataType == null) {
					resultDataType = dataProvider.getResultDataType();
				}

				return invokeGetPagingResult(methodInvocation, dataProvider, parameter, page, resultDataType);
			}
		}

		return methodInvocation.proceed();
	}

	protected abstract Object invokeGetResult(MethodInvocation methodInvocation, DataProvider dataProvider,
			Object parameter, DataType resultDataType) throws Throwable;

	@SuppressWarnings("rawtypes")
	protected abstract Object invokeGetPagingResult(MethodInvocation methodInvocation, DataProvider dataProvider,
			Object parameter, Page page, DataType resultDataType) throws Throwable;

}