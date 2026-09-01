package com.bstek.dorado.data.resolver;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.common.Namable;
import com.bstek.dorado.core.bean.Scopable;
import com.bstek.dorado.core.bean.Scope;

public abstract class AbstractDataResolver implements DataResolver, Namable, Scopable {

	private String name;

	private String id;

	private Scope scope;

	private Object parameter;

	private Map<String, Object> metaData;

	@Override
	@XmlProperty(ignored = true, attributeOnly = true)
	public String getName() {
		return name;
	}

	/**
	 * 设置DataResolver的名称。
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
	@XmlProperty
	public Object getParameter() {
		return parameter;
	}

	@Override
	public void setParameter(Object parameter) {
		this.parameter = parameter;
	}

	protected abstract Object internalResolve(DataItems dataItems, Object parameter) throws Exception;

	@Override
	public Object resolve(DataItems dataItems) throws Exception {
		return internalResolve(dataItems, parameter);
	}

	@Override
	public Object resolve(DataItems dataItems, Object parameter) throws Exception {
		return internalResolve(dataItems, parameter);
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
