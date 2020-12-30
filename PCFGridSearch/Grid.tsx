import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn, ITextField, mergeStyleSets, SelectionMode, Stack, StackItem, TextField } from 'office-ui-fabric-react';
import { IInputs } from './generated/ManifestTypes';

export interface IPCFGridProps {
    gridRecords: any[];
    crmContext: ComponentFramework.Context<IInputs>
}

export class PCFGrid extends React.Component<IPCFGridProps> {

 state={
     gridFilterRecords:new Array(),
     isFilter:false
 }
    private getGenerateColumn(): IColumn[] {
        let gridControlContext = this.props.crmContext;
        let gridRecords = gridControlContext.parameters.listviewDataSet;
        let columnList: IColumn[] = [];
        gridRecords.columns.forEach(function (colitem: any, idx: any) {

            let colwith = (colitem.visualSizeFactor || 150) //+
            let Column: IColumn =
            {
                key: colitem.name + "_" + idx
                , minWidth: colwith - 50
                , maxWidth: colwith
                , name: colitem.displayName
                , isRowHeader: false
                , isResizable: true
                , isCollapsible: false
                , isSorted: false,
                isSortedDescending: false
                , fieldName: colitem.name
                , data: colitem.dataType
                , onRender: (ele: any) => {
                    return (
                        <>
                            <span>
                                {
                                    ele[colitem.name]
                                }
                            </span>
                        </>
                    )
                }
            }
            columnList.push(Column);

        });

        return columnList;
    }


    private _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void=> {
       let searchableColumnList = this.props.crmContext.parameters.searchableColumnLogicalNameList.raw || "";
       let filterRecords:any [] =new Array();
       if(searchableColumnList && searchableColumnList !="") {
        searchableColumnList.split(",").forEach((searchableColumn:string) => {
           let basedColumFilteredRecords =this.props.gridRecords.filter(i => i[searchableColumn].toLowerCase().indexOf(text?.toLowerCase()) > -1);
           filterRecords= [...basedColumFilteredRecords];
            
        });

       }
       else{
        filterRecords =this.props.gridRecords;
       }


        this.setState({
            isFilter:(text && text!=""),
            gridFilterRecords: (text && text!="") ? filterRecords :this.props.gridRecords,
        });
      };
    public render() {
        return (

            <><Stack>
                <StackItem >
                    <TextField
                
                    styles={{
                        root:{
                            width:180,
                            paddingLeft:10,
                            paddingTop:10
                        }
                    }}
                    onChange={this._onChangeText}
                    placeholder={"Search"}
                     />

                </StackItem>
                <StackItem  styles={{root:{padding:10}}}>
                    <DetailsList
                        items={this.state.isFilter ? this.state.gridFilterRecords :this.props.gridRecords}
                        columns={this.getGenerateColumn()}
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        selectionMode={SelectionMode.none}
                       
                    >
                    </DetailsList>
                </StackItem>

            </Stack>
            </>

        );
    }
}
