import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace com.logali.employees.utils
 */

export default class Utils {
    private controller : Controller; //Controlador
    private model : ODataModel; //Modelo
    private resourceBundle : ResourceBundle; //ResourceBundle

    constructor (controller : Controller) {
         this.controller = controller;
         this.model = (this.controller.getOwnerComponent() as UIComponent).getModel("zservice") as ODataModel; 
         this.resourceBundle = ((this.controller.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
    }

    public getSapId () : string {
        return 'valeriaro@gmail.com'
    }

    public async crud (action: string, object?: JSONModel) : Promise<void> {
        const resourceBundle = this.resourceBundle;
        const $this = this;

        MessageBox.confirm(resourceBundle.getText("question")||'No text defined', {
            action: [
                MessageBox.Action.OK,
                MessageBox.Action.CANCEL
            ],
            emphasizedAction: MessageBox.Action.OK,
            onClose: async function (sAction : string) {
                if (sAction === MessageBox.Action.OK) {
                    switch(action){
                        case 'create': await $this._create(object);
                        case 'update': await $this._update();
                        case 'delete': await $this._delete();
                    }
                }
            }
        });
    }

    private async _create (object? : JSONModel) : Promise<void> {
        const model = this.model;
        const path = object?.getProperty("/path");
        const data = object?.getProperty("/data");
        const resourceBundle = this.resourceBundle;

        model.create(path, data, {
            success: function () {
                MessageBox.success(resourceBundle.getText("success") || 'No text defined');
            },
            error: function () {
                MessageBox.error(resourceBundle.getText("error") || 'No text defined');
            }
        });

    }

    private async _update () : Promise<void> {
        
    }

    private async _delete () : Promise<void> {
        
    }

}