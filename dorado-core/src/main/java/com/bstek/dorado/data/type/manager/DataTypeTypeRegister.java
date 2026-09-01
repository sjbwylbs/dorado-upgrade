package com.bstek.dorado.data.type.manager;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.data.type.EntityDataType;
import com.bstek.dorado.spring.RemovableBean;
import com.bstek.dorado.util.clazz.ClassUtils;

/**
 * 用于利用外部的Spring配置文件完成DataProvider类型注册功能的辅助类。
 *
 * @see com.bstek.dorado.data.provider.manager.DataProviderTypeRegistry
 */
public class DataTypeTypeRegister implements InitializingBean, RemovableBean {

	private static final Log logger = LogFactory.getLog(DataTypeTypeRegister.class);

	private DataTypeTypeRegistry dataTypeTypeRegistry;

	private String classType;

	private String type;

	public void setDataTypeTypeRegistry(DataTypeTypeRegistry dataTypeTypeRegistry) {
		this.dataTypeTypeRegistry = dataTypeTypeRegistry;
	}

	/**
	 * 设置DataProvider的Class类型。
	 */
	public void setClassType(String classType) {
		this.classType = classType;
	}

	/**
	 * 设置类型名。
	 */
	public void setType(String type) {
		this.type = type;
	}

	@Override
	@SuppressWarnings("unchecked")
	public void afterPropertiesSet() throws Exception {
		try {
			Class<? extends EntityDataType> cl = ClassUtils.forName(classType);
			DataTypeTypeRegisterInfo registerInfo = new DataTypeTypeRegisterInfo(type, cl);
			dataTypeTypeRegistry.registerType(registerInfo);
		}
		catch (ClassNotFoundException e) {
			logger.error(e, e);
		}
	}

}
