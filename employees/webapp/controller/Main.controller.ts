import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import Input from "sap/m/Input";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";
import { FilterBar$ClearEvent } from "sap/ui/comp/filterbar/FilterBar";
import Control from "sap/ui/core/Control";
import MultiComboBox from "sap/m/MultiComboBox";

/**
 * @namespace com.logali.employees.controller
 */
export default class Main extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        this.loadEmployees();
        this.loadCountries();
    }

    private loadEmployees(): void {
        const model = new JSONModel();
        model.loadData("../model/Employees.json");
        this.setModel(model, "employees");
    }

    private loadCountries(): void {
        const model = new JSONModel();
        model.loadData("../model/Countries.json");
        this.setModel(model, "countries");
    }

    private onFilterSearch(): void {
        let oInput = this.byId("filterEmployee") as Input,
            sEmployee = oInput.getValue();
        let oMultiComboBox = this.byId("filterCountry") as MultiComboBox,
            aCountries = oMultiComboBox.getSelectedKeys();
        let aFilter = [];

        if (sEmployee) {
            aFilter.push(
                new Filter({
                    filters: [
                        new Filter("FirstName", FilterOperator.Contains, sEmployee),
                        new Filter("LastName", FilterOperator.Contains, sEmployee)
                    ],
                    and: false
                })
            );
        }
        if (aCountries.length > 0){
            aCountries.forEach(function(sKey){
                aFilter.push(
                    new Filter("Country", FilterOperator.EQ, sKey)
                );
            });
        } else {
            const oTable = this.byId("table") as Table;
            const items = oTable.getBinding("items") as ListBinding;
            items.filter([]);
        }
        const oTable = this.byId("table") as Table;
        const items = oTable.getBinding("items") as ListBinding;
        items.filter(aFilter);
    }

    public onClearPress (event : FilterBar$ClearEvent) : void {
        const controls = event.getParameter("selectionSet") as Control[];
        const oInput = controls[0] as Input;
        const oMultiComboBox = controls[1] as MultiComboBox;
        oInput.setValue("");
        oMultiComboBox.setSelectedKeys([]);
        this.onFilterSearch();
    }
}