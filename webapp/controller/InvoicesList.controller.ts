
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Component from "../Component";
import Event from "sap/ui/base/Event";
import ObjectListItem from "sap/m/ObjectListItem";
import Context from "sap/ui/model/odata/v2/Context";
import SearchField, { SearchField$SearchEvent } from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import List from "sap/m/List";
import ListBinding from "sap/ui/model/ListBinding";

/**
 * @namespace com.logali.invoices.controller
 */

export default class InvoicesList extends Controller {
    public onInit(): void | undefined {
        this.loadCurrency();
    }

    private loadCurrency(): void {
        const oData: {
            currency : string
        } = {
            currency : "EUR"
        }; 
        const oModel = new JSONModel(oData);
        this.getView()?.setModel(oModel,"currencies");
    }

    public onFilter(event: SearchField$SearchEvent) {
        const value = event.getParameter("query");
        const filters = [];

        if (value){
            filters.push(new Filter ("ProductName", FilterOperator.Contains, value));
        }
        const list = this.byId("list") as List;
        const binding = list.getBinding("items") as ListBinding;
        binding.filter(filters);
    }

    public onNavToDetails(event: Event): void {
        const item = event.getSource() as ObjectListItem; 
        const bindingContext = item.getBindingContext("northwind") as Context;
        const path = bindingContext.getPath();
        const router = (this.getOwnerComponent() as Component).getRouter();
        router.navTo("RouteDetails", {
            path: window.encodeURIComponent(path)
        })

    }
}