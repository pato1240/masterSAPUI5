import Controller from 'sap/ui/core/mvc/Controller';
import JSONModel from 'sap/ui/model/json/JSONModel';

/**
 * @namespace com.logali.invoices.controller
 */

export default class App extends Controller {
   public onInit(): void | undefined {
        this.viewModel();
    }

    public viewModel(): void {
        let oData : {
            recipient: {
                name: string
            }
        } = {
            recipient: {
                name: "World"
            }
        }
        const oModel = new JSONModel(oData) as JSONModel;
        this.getView()?.setModel(oModel,"view");
    }

}