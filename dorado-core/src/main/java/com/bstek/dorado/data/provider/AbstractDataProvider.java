package com.bstek.dorado.data.provider;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.common.Namable;
import com.bstek.dorado.core.bean.Scopable;
import com.bstek.dorado.core.bean.Scope;
import com.bstek.dorado.data.type.DataType;

/**
 * 数据提供者的抽象实现类。
 *
 */
public abstract class AbstractDataProvider implements DataProvider, Namable, Scopable {

	private String name;

	private String id;

	private Scope scope;

	private DataType resultDataType;

	private Object parameter;

	private Map<String, Object> metaData;

	@Override
	@XmlProperty(ignored = true, attributeOnly = true)
	public String getName() {
		return name;
	}

	/**
	 * 设置DataProvider的名称。
	 */
	@Override
	public void setName(String name) {
		this.name = name;
		if (StringUtils.isEmpty(id)) {
			id = name;
		}
	}

	@Override
	@XmlProperty(unsupported = true)
	public String getId() {
		return id;
	}

	@Override
	public void setId(String id) {
		this.id = id;
	}

	@Override
	@XmlProperty(ignored = true, attributeOnly = true)
	public Scope getScope() {
		return scope;
	}

	@Override
	public void setScope(Scope scope) {
		this.scope = scope;
	}

	@Override
	public DataType getResultDataType() {
		return resultDataType;
	}

	@Override
	public void setResultDataType(DataType resultDataType) {
		this.resultDataType = resultDataType;
	}

	@Override
	@XmlProperty
	@IdeProperty(editor = "pojo")
	public Object getParameter() {
		return parameter;
	}

	@Override
	public void setParameter(Object parameter) {
		this.parameter = parameter;
	}

	/**
	 * 内部的获得返回给外界的数据的方法。
	 * @param parameter 参数
	 * @param resultDataType 结果的数据类型。
	 * @return 要返回给外界的数据
	 * @throws Exception
	 */
	protected abstract Object internalGetResult(Object parameter, DataType resultDataType) throws Exception;

	/**
	 * 内部的获得返回给外界的数据的方法。
	 * @param parameter 参数
	 * @param page 用于封装分页结果的对象。
	 * @param resultDataType 结果的数据类型。
	 * @throws Exception
	 * @see com.bstek.dorado.data.provider.Page
	 */
	protected abstract void internalGetPagingResult(Object parameter, Page<?> page, DataType resultDataType)
			throws Exception;

	@Override
	public Object getResult() throws Exception {
		return internalGetResult(parameter, resultDataType);
	}

	@Override
	public Object getResult(Object parameter) throws Exception {
		if (parameter == null && this.parameter != null) {
			parameter = this.parameter;
		}
		return internalGetResult(parameter, resultDataType);
	}

	@Override
	public Object getResult(Object parameter, DataType resultDataType) throws Exception {
		if (parameter == null && this.parameter != null) {
			parameter = this.parameter;
		}
		if (resultDataType == null) {
			resultDataType = this.resultDataType;
		}
		return internalGetResult(parameter, resultDataType);
	}

	@Override
	public void getPagingResult(Page<?> page) throws Exception {
		internalGetPagingResult(parameter, page, resultDataType);
	}

	@Override
	public void getPagingResult(Object parameter, Page<?> page) throws Exception {
		if (parameter == null && this.parameter != null) {
			parameter = this.parameter;
		}
		internalGetPagingResult(parameter, page, resultDataType);
	}

	@Override
	public void getPagingResult(Object parameter, Page<?> page, DataType resultDataType) throws Exception {
		if (parameter == null && this.parameter != null) {
			parameter = this.parameter;
		}
		if (resultDataType == null) {
			resultDataType = this.resultDataType;
		}
		internalGetPagingResult(parameter, page, resultDataType);
	}

	@Override
	@XmlProperty(composite = true)
	@ClientProperty(ignored = true)
	public Map<String, Object> getMetaData() {
		return metaData;
	}

	@Override
	public void setMetaData(Map<String, Object> metaData) {
		this.metaData = metaData;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

}
