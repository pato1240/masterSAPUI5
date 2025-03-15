import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller"
import ListBinding from "sap/ui/model/ListBinding";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

export default {
     titleFormatter: function (this: Controller){
        const resourceBundle = <ResourceBundle>(this.getOwnerComponent()?.getModel("i18n") as ResourceModel).getResourceBundle();
        var oBinding = this.byId("table")?.getBinding("items") as ListBinding;
        oBinding.attachChange(function () {
            console.log(oBinding.getLength());
            return resourceBundle.getText("title",[oBinding.getLength()]);
        }, this);
        return resourceBundle.getText("title",[oBinding.getLength()]);
    }
}