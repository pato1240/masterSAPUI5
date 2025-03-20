import Title from "sap/m/Title";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.logali.employees.controller
 */
export default class App extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        this.viewModel();
        this.loadEmployees();
    }

    private viewModel(): void {
        const data = {
            layout: "OneColumn",
            title: ""
        };
        const model = new JSONModel(data);
        this.setModel(model, "view");
    }

    private loadEmployees(): void {
        const model = new JSONModel();
        model.loadData("../model/Employees.json");
        this.setModel(model, "employees");
    }


}