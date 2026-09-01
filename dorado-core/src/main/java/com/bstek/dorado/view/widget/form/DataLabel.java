package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.datacontrol.AbstractPropertyDataControl;

@Widget(name = "DataLabel", category = "Form", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.Label", shortTypeName = "Label")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH }, deprecated = true)
@Deprecated
public class DataLabel extends AbstractPropertyDataControl {

}
