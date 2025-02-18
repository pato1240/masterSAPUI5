import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { def } from "sap/gantt/library";

export default {
    statusText : function (this : Controller , status : string) {
        const resourceBundle= <ResourceBundle>(this.getOwnerComponent()?.getModel("i18n") as ResourceModel).getResourceBundle();
        switch (status){
            case 'A' : return resourceBundle.getText("invoiceStatusA");
            case 'B' : return resourceBundle.getText("invoiceStatusB");
            case 'C' : return resourceBundle.getText("invoiceStatusC");
            default:
                return status;
        }
    }
}