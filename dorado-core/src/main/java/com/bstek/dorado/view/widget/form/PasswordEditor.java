package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "PasswordEditor", category = "Form", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.PasswordEditor", shortTypeName = "PasswordEditor")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class PasswordEditor extends AbstractTextEditor {

}
