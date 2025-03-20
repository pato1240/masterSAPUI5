import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller"
import JSONModel from "sap/ui/model/json/JSONModel";
import ListBinding from "sap/ui/model/ListBinding";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

export default {
    
     titleFormatter: async function (this: Controller) {
        const resourceBundle = <ResourceBundle>(this.getOwnerComponent()?.getModel("i18n") as ResourceModel).getResourceBundle();
        var oBinding = this.byId("table")?.getBinding("items") as ListBinding;

        if(!oBinding) {
            return resourceBundle.getText("title", [0])
        }
        console.log(oBinding);
        const newTitle = resourceBundle.getText("title",[oBinding.getLength()]);

        oBinding.attachChange( () => {
            let viewModel = this.getView()?.getModel("view") as JSONModel;
            viewModel.setProperty("/title", newTitle);
        });

        return newTitle;
    }
}