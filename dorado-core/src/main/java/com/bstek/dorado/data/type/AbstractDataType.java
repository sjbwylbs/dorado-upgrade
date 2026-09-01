package com.bstek.dorado.data.type;

import java.util.Map;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;

import javassist.Modifier;

/**
 * DataType的抽象实现类。
 *
 */
@XmlNode(nodeName = "DataType")
public abstract class AbstractDataType implements RudeDataType {

	private String name;

	private String id;

	private Class<?> matchType;

	private Class<?> creationType;

	private String tags;

	private Map<String, Object> metaData;

	@Override
	@XmlProperty(ignored = true, attributeOnly = true)
	public String getName() {
		return name;
	}

	/**
	 * 设置DataType的名称。
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
	@ClientProperty(ignored = true)
	public Class<?> getMatchType() {
		return matchType;
	}

	@Override
	public void setMatchType(Class<?> matchType) {
		this.matchType = matchType;
		if (creationType == null && !matchType.isInterface() && !Modifier.isAbstract(matchType.getModifiers())) {
			creationType = matchType;
		}
	}

	@Override
	@ClientProperty(ignored = true)
	public Class<?> getCreationType() {
		return creationType;
	}

	@Override
	public void setCreationType(Class<?> creationType) {
		this.creationType = creationType;
	}

	@Override
	public String getTags() {
		return tags;
	}

	@Override
	public void setTags(String tags) {
		this.tags = tags;
	}

	@Override
	public String toText(Object value) {
		return (value == null) ? null : value.toString();
	}

	@Override
	public Object fromObject(Object value) {
		if (value == null) {
			return null;
		}

		Class<?> targetType = this.getMatchType();
		if (targetType == null) {
			return value;
		}
		else if (targetType.isAssignableFrom(value.getClass())) {
			return value;
		}

		throw new DataConvertException(value.getClass(), getMatchType());
	}

	public Object toObject(Object value) {
		if (value == null) {
			return null;
		}

		Class<?> targetType = this.getMatchType();
		if (targetType != null && !targetType.isAssignableFrom(value.getClass())) {
			throw new IllegalArgumentException(
					"Type error! " + targetType.getName() + " expected but " + value.getClass().getName() + " found.");
		}
		return value;
	}

	@Override
	public String toString() {
		return ObjectUtils.identityToString(this) + " [" + "name=" + getName() + ", " + "matchType=" + getMatchType()
				+ "]";
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

}
