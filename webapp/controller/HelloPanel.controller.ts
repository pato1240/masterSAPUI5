import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Dialog from "sap/m/Dialog";
import MessageToast from "sap/m/MessageToast";
import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace com.logali.invoices.controller
 */

export default class HelloPanel extends Controller {

    private dialog: Dialog

    onInit(): void | undefined {

    }

    public onShowHello(): void {
        let oResourceModel = <ResourceBundle>(<ResourceModel>this.getOwnerComponent()?.getModel("i18n")).getResourceBundle();
        let sText = oResourceModel?.getText("helloWorld");
        MessageToast.show(sText || "no text defined");
    }

    public async onOpenDialog(): Promise<void> {
        if (!this.dialog) {
            this.dialog = await <Promise<Dialog>>this.loadFragment({
                name: "com.logali.invoices.fragment.HelloDialog"
            })
        }
        this.dialog.open();
    }

    public onClose(): void {
        this.dialog.close();
    }
}