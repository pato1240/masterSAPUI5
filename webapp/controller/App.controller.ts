import Controller from 'sap/ui/core/mvc/Controller';
import MessageToast from 'sap/m/MessageToast';
import ResourceModel from 'sap/ui/model/resource/ResourceModel';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import JSONModel from 'sap/ui/model/json/JSONModel';

/**
 * @namespace com.logali.invoices.controller
 */

export default class App extends Controller {
   public onInit(): void | undefined {
        this.viewModel();
    }

    public onShowHello(): void {
        let oResourceModel = <ResourceBundle> (<ResourceModel> this.getOwnerComponent()?.getModel("i18n")).getResourceBundle();
        let sText = oResourceModel?.getText("helloWorld");
        MessageToast.show(sText || "no text defined");
    } 

    public viewModel(): void {
        let oData = {
            recipient: {
                name: "World"
            }
        }
        const oModel = new JSONModel(oData) as JSONModel;
        this.getView()?.setModel(oModel,"view");
    }

}