package com.bstek.dorado.data.type;

import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlSubNode;

/**
 * Bean类型的默认实现类。
 *
 */
@XmlNode(label = "DataType",
		subNodes = { @XmlSubNode(
				implTypes = { "com.bstek.dorado.data.type.property.BasePropertyDef",
						"com.bstek.dorado.data.type.property.Reference" },
				propertyType = "com.bstek.dorado.data.type.property.PropertyDef[]") })
public class DefaultEntityDataType extends EntityDataTypeSupport {

}
