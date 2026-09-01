package com.bstek.dorado.data.provider;

import java.util.Collection;

import org.aopalliance.intercept.MethodInvocation;

import com.bstek.dorado.data.entity.EntityUtils;
import com.bstek.dorado.data.type.DataType;

public final class DataProviderGetResultMethodInterceptor extends AbstractDataProviderGetResultMethodInterceptor {

	@Override
	protected Object invokeGetResult(MethodInvocation methodInvocation, DataProvider dataProvider, Object parameter,
			DataType resultDataType) throws Throwable, Exception {
		Object result = methodInvocation.proceed();
		if (result != null) {
			result = EntityUtils.toEntity(result, resultDataType);
		}
		return result;
	}

	@Override
	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected Object invokeGetPagingResult(MethodInvocation methodInvocation, DataProvider dataProvider,
			Object parameter, Page page, DataType resultDataType) throws Throwable, Exception {
		Object returnValue = methodInvocation.proceed();
		if (page != null) {
			Collection entities = page.getEntities();
			if (entities != null) {
				entities = (Collection) EntityUtils.toEntity(entities, resultDataType);
				page.setEntities(entities);
			}
		}
		return returnValue;
	}

}
