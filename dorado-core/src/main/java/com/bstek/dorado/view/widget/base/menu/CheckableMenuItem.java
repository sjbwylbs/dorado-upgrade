package com.bstek.dorado.view.widget.base.menu;

import com.bstek.dorado.annotation.ClientEvent;
import com.bstek.dorado.annotation.ClientEvents;
import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;

@ClientObject(prototype = "dorado.widget.menu.CheckableMenuItem", shortTypeName = "Checkable")
@ClientEvents({ @ClientEvent(name = "onCheckedChange") })
@XmlNode(clientTypes = ClientType.DESKTOP)
public class CheckableMenuItem extends MenuItem {

	private boolean checked;

	private String group;

	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

}
