import React = require("react");
import ReactDOM = require("react-dom");
import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { PCFGrid } from "./Grid";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class PCFGridSearch implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	_mainContainer:HTMLDivElement;
	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._mainContainer =container;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if (!context.parameters.listviewDataSet.loading) {
			if (context.parameters.listviewDataSet.paging != null && context.parameters.listviewDataSet.paging.hasNextPage == true) {
				context.parameters.listviewDataSet.paging.setPageSize(5000);
				context.parameters.listviewDataSet.paging.loadNextPage();
			}
			else {
				let contextViewData = this.getViewData(context);

		ReactDOM.render( React.createElement(PCFGrid,{
			gridRecords:contextViewData,
			crmContext:context			
		}),this._mainContainer)
	}
	}
}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

	public getViewData(context: ComponentFramework.Context<IInputs>): any[] {
		let gridDataSet = context.parameters.listviewDataSet;
		let columnDatalist: any[] = [];
		gridDataSet.sortedRecordIds.map(function (item: any) {
			let record = gridDataSet.records[item];
			let currentGridId = record.getRecordId();
			let ColumnData: any = {};
			gridDataSet.columns.forEach(function (colItem: any, idx: any) {
				ColumnData.key = item + "_" + idx;
				ColumnData[colItem.name] = gridDataSet.records[currentGridId].getFormattedValue(colItem.name);
				ColumnData.url = "";
				ColumnData.id = currentGridId;
				ColumnData.columnobj = gridDataSet.records[currentGridId].getValue(colItem.name);
				ColumnData[colItem.name + "_Obj"] = gridDataSet.records[currentGridId].getValue(colItem.name);
			});
			columnDatalist.push(ColumnData);
		});
		return columnDatalist;
	}

}