package com.bstek.dorado.view.widget.list;

import com.bstek.dorado.annotation.ClientEvent;
import com.bstek.dorado.annotation.ClientEvents;
import com.bstek.dorado.annotation.ClientProperty;

@ClientEvents({ @ClientEvent(name = "onDataRowClick"), @ClientEvent(name = "onDataRowDoubleClick") })
public abstract class RowList extends AbstractList {

	private int rowHeight;

	private boolean highlightCurrentRow = true;

	private boolean highlightHoverRow = true;

	private boolean highlightSelectedRow = true;

	public int getRowHeight() {
		return rowHeight;
	}

	public void setRowHeight(int rowHeight) {
		this.rowHeight = rowHeight;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isHighlightCurrentRow() {
		return highlightCurrentRow;
	}

	public void setHighlightCurrentRow(boolean highlightCurrentRow) {
		this.highlightCurrentRow = highlightCurrentRow;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isHighlightHoverRow() {
		return highlightHoverRow;
	}

	public void setHighlightHoverRow(boolean highlightHoverRow) {
		this.highlightHoverRow = highlightHoverRow;
	}

	@ClientProperty(escapeValue = "true")
	public boolean isHighlightSelectedRow() {
		return highlightSelectedRow;
	}

	public void setHighlightSelectedRow(boolean highlightSelectedRow) {
		this.highlightSelectedRow = highlightSelectedRow;
	}

}
