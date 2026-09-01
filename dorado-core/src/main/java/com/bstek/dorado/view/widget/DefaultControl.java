package com.bstek.dorado.view.widget;

import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "Control", category = "General", dependsPackage = "widget")
@XmlNode(nodeName = "Control", clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class DefaultControl extends Control {

}
