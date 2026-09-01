package com.bstek.dorado.uploader.widget;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.IdeObject;
import com.bstek.dorado.annotation.XmlNode;

@XmlNode
@ClientObject
@IdeObject(labelProperty = "title")
public class Filter {

	private String title;
	private String extensions;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getExtensions() {
		return extensions;
	}

	public void setExtensions(String extensions) {
		this.extensions = extensions;
	}
}
