import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";

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
}