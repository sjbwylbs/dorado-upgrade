package com.bstek.dorado.view.widget.base.menu;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;

@ClientObject(prototype = "dorado.widget.menu.Separator", shortTypeName = "Separator")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class Separator extends BaseMenuItem {

}
