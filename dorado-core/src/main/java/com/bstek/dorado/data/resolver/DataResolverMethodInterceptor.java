package com.bstek.dorado.data.resolver;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.aopalliance.intercept.MethodInvocation;

import com.bstek.dorado.data.entity.EntityUtils;
import com.bstek.dorado.data.type.CustomEntityDataType;
import com.bstek.dorado.data.type.DataType;
import com.bstek.dorado.data.variant.Record;

public class DataResolverMethodInterceptor extends AbstractDataResolverMethodInterceptor {

	@Override
	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected Object invokeResolve(MethodInvocation methodInvocation, DataResolver dataResolver, DataItems dataItems,
			Object parameter) throws Throwable {
		DataItems swapDataItems = null;
		for (Map.Entry<String, Object> entry : dataItems.entrySet()) {
			String key = null;
			Object data = entry.getValue();
			if (data instanceof Collection) {
				boolean dataTypeRetrieved = false;
				CustomEntityDataType customEntityDataType = null;

				Collection collection = (Collection) data;
				Collection newCollection = null;

				for (Object element : collection) {
					if (!dataTypeRetrieved) {
						dataTypeRetrieved = true;
						DataType dataType = EntityUtils.getDataType(element);
						if (dataType != null && dataType instanceof CustomEntityDataType) {
							customEntityDataType = (CustomEntityDataType) dataType;
						}
					}

					if (customEntityDataType != null && element instanceof Record) {
						element = customEntityDataType.fromMap((Record) element);

						if (newCollection == null) {
							if (data instanceof Set) {
								newCollection = new HashSet(collection.size());
							}
							else {
								newCollection = new ArrayList(collection.size());
							}
						}
						newCollection.add(element);
					}
				}

				if (newCollection != null) {
					data = newCollection;
					key = entry.getKey();
				}
			}
			else if (data instanceof Record) {
				DataType dataType = EntityUtils.getDataType(data);
				if (dataType != null && dataType instanceof CustomEntityDataType) {
					data = ((CustomEntityDataType) dataType).fromMap((Record) data);
					key = entry.getKey();
				}
			}

			if (key != null) {
				if (swapDataItems == null) {
					swapDataItems = new DataItems();
				}
				swapDataItems.put(key, data);
			}
		}

		if (swapDataItems != null) {
			for (Map.Entry<String, Object> entry : swapDataItems.entrySet()) {
				String alias = entry.getKey();
				Object originData = dataItems.get(alias);
				dataItems.set(alias, entry.getValue());
				entry.setValue(originData);
			}
		}
		try {
			return methodInvocation.proceed();
		}
		finally {
			if (swapDataItems != null) {
				for (Map.Entry<String, Object> entry : swapDataItems.entrySet()) {
					String alias = entry.getKey();
					dataItems.set(alias, entry.getValue());
				}
			}
		}
	}

}
