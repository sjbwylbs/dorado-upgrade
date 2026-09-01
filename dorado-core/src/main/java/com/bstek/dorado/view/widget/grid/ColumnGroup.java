package com.bstek.dorado.view.widget.grid;

import java.util.List;

import com.bstek.dorado.annotation.ClientObject;
import com.bstek.dorado.annotation.ClientProperty;
import com.bstek.dorado.annotation.IdeProperty;
import com.bstek.dorado.annotation.XmlSubNode;
import com.bstek.dorado.view.widget.Align;
import com.bstek.dorado.view.widget.InnerElementList;

@ClientObject(shortTypeName = "Group")
public class ColumnGroup extends Column implements ColumnHolder {

	private List<Column> columns = new InnerElementList<>(this);

	@Override
	@IdeProperty(visible = false)
	@ClientProperty(ignored = true)
	public Align getAlign() {
		return null;
	}

	@Override
	public void addColumn(Column column) {
		columns.add(column);
	}

	@Override
	@XmlSubNode
	@ClientProperty
	public List<Column> getColumns() {
		return columns;
	}

}
