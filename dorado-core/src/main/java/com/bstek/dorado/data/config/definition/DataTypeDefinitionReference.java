package com.bstek.dorado.data.config.definition;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.config.definition.DefinitionReference;
import com.bstek.dorado.core.Context;

public class DataTypeDefinitionReference implements DefinitionReference<DataTypeDefinition> {

	private static Log logger = LogFactory.getLog(DataTypeDefinitionReference.class);

	private static DataTypeDefinitionManager dataTypeDefinitionManager;

	private String name;

	/**
	 * @param definitionManager 配置声明管理器
	 * @param name 指向的声明对象在注册时使用的名称
	 */
	public DataTypeDefinitionReference(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	private DataTypeDefinitionManager getDataTypeDefinitionManager() {
		if (dataTypeDefinitionManager == null) {
			try {
				Context current = Context.getCurrent();
				dataTypeDefinitionManager = (DataTypeDefinitionManager) current
					.getServiceBean("dataTypeDefinitionManager");
			}
			catch (Exception e) {
				logger.error(e, e);
			}
		}
		return dataTypeDefinitionManager;
	}

	@Override
	public DataTypeDefinition getDefinition() {
		Context current = Context.getCurrent();
		DataTypeDefinitionManager dtfm = (DataTypeDefinitionManager) current.getAttribute(Context.THREAD,
				"privateDataTypeDefinitionManager");
		if (dtfm == null) {
			dtfm = getDataTypeDefinitionManager();
		}

		DataTypeDefinition definition = null;
		if (dtfm != null) {
			definition = dtfm.getDefinition(name);
		}
		if (definition == null) {
			throw new IllegalArgumentException("Unrecognized DataType \"" + name + "\".");
		}
		return definition;
	}

}
