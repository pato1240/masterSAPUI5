import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.logali.employees.controller
 */
export default class App extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        this.viewModel();
    }

    private viewModel(): void {
        const data = {
            layout: "OneColumn"
        };
        const model = new JSONModel(data);
        this.setModel(model, "view");
    }
}