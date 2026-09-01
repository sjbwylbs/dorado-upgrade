package com.bstek.dorado.view.widget.tree;

import java.util.ArrayList;
import java.util.List;

import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.common.Ignorable;
import com.bstek.dorado.common.TagSupport;
import com.bstek.dorado.view.UserDataSupport;

@XmlNode(implTypes = "com.bstek.dorado.view.widget.tree.*")
public abstract class BaseNode implements NodeHolder, TagSupport, Ignorable, UserDataSupport {

	private List<BaseNode> nodes;

	private String label;

	private String icon;

	private String iconClass;

	private String expandedIcon;

	private String expandedIconClass;

	private boolean checkable;

	private boolean checked;

	private boolean autoCheckChildren = true;

	private String tip;

	private Object data;

	private Object userData;

	private boolean hasChild;

	private boolean expanded;

	private String tags;

	private boolean ignored;

	@Override
	@XmlSubNode
	@ClientProperty
	public List<BaseNode> getNodes() {
		if (nodes == null) {
			nodes = new ArrayList<>();
		}
		return nodes;
	}

	@Override
	public void addNode(BaseNode node) {
		getNodes().add(node);
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getIconClass() {
		return iconClass;
	}

	public void setIconClass(String iconClass) {
		this.iconClass = iconClass;
	}

	public String getExpandedIcon() {
		return expandedIcon;
	}

	public void setExpandedIcon(String expandedIcon) {
		this.expandedIcon = expandedIcon;
	}

	public String getExpandedIconClass() {
		return expandedIconClass;
	}

	public void setExpandedIconClass(String expandedIconClass) {
		this.expandedIconClass = expandedIconClass;
	}

	public boolean isCheckable() {
		return checkable;
	}

	public void setCheckable(boolean checkable) {
		this.checkable = checkable;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isAutoCheckChildren() {
		return autoCheckChildren;
	}

	public void setAutoCheckChildren(boolean autoCheckChildren) {
		this.autoCheckChildren = autoCheckChildren;
	}

	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}

	public String getTip() {
		return tip;
	}

	public void setTip(String tip) {
		this.tip = tip;
	}

	@XmlProperty
	@ClientProperty
	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	@Override
	@XmlProperty
	@ClientProperty
	public Object getUserData() {
		return userData;
	}

	@Override
	public void setUserData(Object userData) {
		this.userData = userData;
	}

	public boolean isHasChild() {
		return hasChild;
	}

	public void setHasChild(boolean hasChild) {
		this.hasChild = hasChild;
	}

	public boolean isExpanded() {
		return expanded;
	}

	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
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
	@ClientProperty(ignored = true)
	public boolean isIgnored() {
		return ignored;
	}

	@Override
	public void setIgnored(boolean ignored) {
		this.ignored = ignored;
	}

}
