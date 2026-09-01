package com.bstek.dorado.view.widget.form.trigger;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;

@Widget(name = "YearMonthDropDown", category = "Trigger", dependsPackage = "base-widget-desktop", autoGenerateId = true)
@ClientObject(prototype = "dorado.widget.YearMonthDropDown", shortTypeName = "YearMonthDropDown")
@XmlNode(clientTypes = ClientType.DESKTOP)
public class YearMonthDropDown extends DropDown {

}
