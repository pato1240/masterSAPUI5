import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";

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

    public async crud (action: string, object?: JSONModel) : Promise<void|ODataListBinding> {
        const resourceBundle = this.resourceBundle;
        const $this = this;

        return new Promise((resolve) =>{
            MessageBox.confirm(resourceBundle.getText("question")||'No text defined', {
                actions: [
                    MessageBox.Action.OK,
                    MessageBox.Action.CANCEL
                ],
                emphasizedAction: MessageBox.Action.OK,
                onClose: async function (sAction : string) {
                    if (sAction === MessageBox.Action.OK) {
                        switch(action){
                            case 'create': resolve(await $this._create(object));break;
                            case 'update': resolve(await $this._update(object));break;
                            case 'delete': resolve(await $this._delete(object));break;
                        }
                    }
                }
            });
        });
    }

    public async read (object?: JSONModel) : Promise<void|ODataListBinding> {
        const model = this.model;
        const path = "/IncidentsSet";
        const filters = object?.getProperty("/filters");

        return new Promise ((resolve,reject)=>{
            model.read(path, {
                filters: filters,
                success: function (data: ODataListBinding) {
                    resolve(data); //return
                },
                error: function () {
                    reject();
                }
            });

        });
    }

    private async _create (object? : JSONModel) : Promise<void|ODataListBinding> {
        const model = this.model;
        const path = object?.getProperty("/path");
        const data = object?.getProperty("/data");
        const resourceBundle = this.resourceBundle;
        const $this = this;

        return new Promise((resolve, reject)=>{
            model.create(path, data, {
                success: async function () {
                    MessageBox.success(resourceBundle.getText("success") || 'No text defined');
                    resolve(await $this.read(object));
                },
                error: function () {
                    MessageBox.error(resourceBundle.getText("error") || 'No text defined');
                    reject();
                }
            });
        });
    }

    private async _update (object?: JSONModel) : Promise<void|ODataListBinding> {
        const model = this.model;
        const path = object?.getProperty("/path");
        const data = object?.getProperty("/data");
        const resourceBundle = this.resourceBundle;
        const $this = this;

        return new Promise((resolve, reject) =>{
            model.update(path, data, {
                success: async function() {
                    MessageBox.success(resourceBundle.getText("success")||'No text defined');
                    resolve(await $this.read(object));
                },
                error: function() {
                    MessageBox.error(resourceBundle.getText("error")||'No text defined');
                    reject();
                }
            });
        });        
    }

    private async _delete (object?: JSONModel) : Promise<void|ODataListBinding> {
        const model = this.model;
        const path = object?.getProperty("/path");
        const resourceBundle = this.resourceBundle;
        const $this = this;

        return new Promise((resolve, reject) =>{
            model.remove(path, {
                success: async function() {
                    MessageBox.success(resourceBundle.getText("success")||'No text defined');
                    resolve(await $this.read(object));
                },
                error: function() {
                    MessageBox.error(resourceBundle.getText("error")||'No text defined');
                    reject();
                }
            }); 
        });
    }

}