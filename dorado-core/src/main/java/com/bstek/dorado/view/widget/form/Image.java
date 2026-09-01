package com.bstek.dorado.view.widget.form;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.widget.datacontrol.AbstractPropertyDataControl;

@Widget(name = "Image", category = "Form", dependsPackage = "base-widget")
@ClientObject(prototype = "dorado.widget.Image", shortTypeName = "Image")
@XmlNode(clientTypes = { ClientType.DESKTOP, ClientType.TOUCH })
public class Image extends AbstractPropertyDataControl {

	private String image;

	private String blankImage;

	private ImageStretchMode stretchMode = ImageStretchMode.keepRatio;

	private ImagePackMode packMode = ImagePackMode.center;

	@IdeProperty(highlight = 1)
	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getBlankImage() {
		return blankImage;
	}

	public void setBlankImage(String blankImage) {
		this.blankImage = blankImage;
	}

	@ClientProperty(escapeValue = "keepRatio")
	public ImageStretchMode getStretchMode() {
		return stretchMode;
	}

	public void setStretchMode(ImageStretchMode stretchMode) {
		this.stretchMode = stretchMode;
	}

	@ClientProperty(escapeValue = "center")
	public ImagePackMode getPackMode() {
		return packMode;
	}

	public void setPackMode(ImagePackMode packMode) {
		this.packMode = packMode;
	}

}
