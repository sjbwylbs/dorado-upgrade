package com.bstek.dorado.view.widget.form.trigger;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "MonthDropDown", category = "Trigger", dependsPackage = "base-widget-desktop", autoGenerateId = true)
@ClientObject(prototype = "dorado.widget.MonthDropDown", shortTypeName = "MonthDropDown")
@XmlNode(clientTypes = ClientType.DESKTOP)
public class MonthDropDown extends DropDown {

}
