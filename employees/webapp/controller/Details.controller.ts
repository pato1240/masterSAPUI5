import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import Panel from "sap/m/Panel";
import { Button$PressEvent } from "sap/m/Button";
import Button from "sap/m/Button";
import Context from "sap/ui/model/Context";
import Utils from "../utils/utils";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import Toolbar from "sap/m/Toolbar";
import { DatePicker$ChangeEvent } from "sap/m/DatePicker";
import { Input$LiveChangeEvent } from "sap/m/Input";
import { Select$ChangeEvent } from "sap/m/Select";
import MessageBox from "sap/m/MessageBox";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ObjectListItem from "sap/m/ObjectListItem";
import Event from "sap/ui/base/Event";

/**
 * @namespace com.logali.employees.controller
 */

export default class Details extends BaseController {
    panel: Panel;

    public onInit(): void | undefined {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this.onObjectMatched.bind(this));

        this.formModel();
    }

    private formModel(): void {
        const model = new JSONModel([]);
        this.setModel(model, "form");
    }

    private onObjectMatched(event: Route$PatternMatchedEvent): void {
        const arg = event.getParameter("arguments") as any;
        const id = arg.id;
        const view = this.getView() as View;
        const $this = this;

        view.bindElement({
            path: `/Employees(${id})/`,
            model: 'northwind',
            events: {
                change: function () {
                    $this.read();
                }
            }
        });
    }

    public onClosePress(): void {
        const router = this.getRouter();
        const viewModel = this.getModel("view") as JSONModel;
        viewModel.setProperty("/layout", "OneColumn");
        router.navTo("RouteMain");
    }

    private removeAllContent(): void {
        const panel = this.byId("tableIncidence") as Panel;
        panel.removeAllContent();
    }

    public async onCreatePress(): Promise<void> {
        const panel = this.byId("tableIncidence") as Panel;
        const formModel = this.getModel("form") as JSONModel;
        const aData = formModel.getData();
        const index = aData.length;
        aData.push({ Index: index + 1, _ValidateDate: false, EnabledSave: false });
        formModel.refresh();

        this.panel = await <Promise<Panel>>this.loadFragment({
            name: "com.logali.employees.fragment.NewIncidence"
        });

        this.panel.bindElement({
            path: 'form>/' + index,
            model: 'form'
        });

        panel.addContent(this.panel);

    }

    public async onSavePress(event: Button$PressEvent): Promise<void> {
        const button = event.getSource() as Button;
        const toolbar = button.getParent() as Toolbar;
        const panel = toolbar.getParent() as Panel;
        const bindingContext = panel.getBindingContext("form") as Context;
        // console.log(bindingContext.getObject());

        const utils = new Utils(this);
        const northwind = this.getView()?.getBindingContext("northwind");
        let employeeId = (northwind?.getProperty("EmployeeID") as Number).toString();
        let sapId = utils.getSapId();

        if (typeof bindingContext.getProperty("IncidenceId") === 'undefined') {
            //Creamos registro

            let object = {
                path: '/IncidentsSet',
                data: {
                    SapId: sapId,
                    EmployeeId: employeeId,
                    CreationDate: bindingContext.getProperty("CreationDate"),
                    Type: bindingContext.getProperty("Type"),
                    Reason: bindingContext.getProperty("Reason")
                },
                filters: [
                    new Filter("SapId", FilterOperator.EQ, sapId),
                    new Filter("EmployeeId", FilterOperator.EQ, employeeId)
                ]
            };

            const results = await utils.crud('create', new JSONModel(object));
            this.showIncidences(results);

        } else {
            //Actualizamos registro

            const incidenceId = bindingContext.getProperty("IncidenceId");
            const object = {
                path: `/IncidentsSet(IncidenceId='${incidenceId}',SapId='${sapId}',EmployeeId='${employeeId}')`,
                data: {
                    SapId: sapId,
                    EmployeeId: employeeId,
                    CreationDate: bindingContext.getProperty("CreationDate"),
                    CreationDateX: bindingContext.getProperty("CreationDateX"),
                    Type: bindingContext.getProperty("Type"),
                    TypeX: bindingContext.getProperty("TypeX"),
                    Reason: bindingContext.getProperty("Reason"),
                    ReasonX: bindingContext.getProperty("ReasonX")
                },
                filters: [
                    new Filter("SapId", FilterOperator.EQ, sapId),
                    new Filter("EmployeeId", FilterOperator.EQ, employeeId)
                ]
            }
            const results = await utils.crud('update', new JSONModel(object));
            this.showIncidences(results);
        }
    }

    private async read(): Promise<void> {
        const northwind = this.getView()?.getBindingContext("northwind");
        const sEmployeeId = (northwind?.getProperty("EmployeeID") as Number).toString();
        const utils = new Utils(this);
        const sSapId = utils.getSapId();

        const object = {
            path: '/IncidentsSet',
            filters: [
                new Filter("SapId", FilterOperator.EQ, sSapId),
                new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId)
            ]
        };
        const results = await utils.read(new JSONModel(object));
        this.showIncidences(results);
    }

    public async onDeletePress(event: Button$PressEvent): Promise<void> {

        const button = event.getSource() as Button;
        const toolbar = button.getParent() as Toolbar;
        const panel = toolbar.getParent() as Panel;

        const form = panel.getBindingContext("form") as Context;

        const incidenceId = form?.getProperty("IncidenceId");
        const sapId = form?.getProperty("SapId");
        const employeeId = form?.getProperty("EmployeeId");

        if (typeof incidenceId === "undefined") {
            panel.destroy()
        } else {
            let object = {
                path: `/IncidentsSet(IncidenceId='${incidenceId}',SapId='${sapId}',EmployeeId='${employeeId}')`,
                filters: [
                    new Filter("SapId", FilterOperator.EQ, sapId),
                    new Filter("EmployeeId", FilterOperator.EQ, employeeId)
                ]
            }
            const utils = new Utils(this);
            const results = await utils.crud('delete', new JSONModel(object));
            this.showIncidences(results);
        };
    }

    private showIncidences(results: ODataListBinding | void) {
        //Limpiar incidencias
        const panel = this.byId("tableIncidence") as Panel;
        panel.removeAllContent();

        //Setear el tipo de dato
        const array = results as any;
        const formModel = this.getModel("form") as JSONModel;
        formModel.setData(array.results);

        //Hacer el mapeo
        array.results.forEach(async (incidence: object, index: number) => {
            const newIncidence = await <Promise<Panel>>this.loadFragment({ name: "com.logali.employees.fragment.NewIncidence" });
            newIncidence.bindElement("form>/" + index);
            panel.addContent(newIncidence);
        });
    }

    public updateIncidenceDate(event: DatePicker$ChangeEvent): void {
        const resourceBundle = ((this.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
        const context = event.getSource().getBindingContext("form") as Context;
        let object = context.getObject() as any;

        if (!event.getSource().isValidValue()) {
            object._ValidateDate = false;
            object.DateState = "Error";
            MessageBox.error(resourceBundle.getText("invalidDate") || 'No text defined');
        } else {
            object._ValidateDate = true;
            object.DateState = "None"
            object.CreationDateX = true;
        };

        if (event.getSource().getValue() && event.getSource().isValidValue() && object.Reason) {
            object.EnabledSave = true;
        } else {
            object.EnabledSave = false;
        };

        context.getModel().refresh();
    }

    public updateIncidenceReason(event: Input$LiveChangeEvent): void {
        const context = event.getSource().getBindingContext("form") as Context;
        let object = context.getObject() as any;

        if (!event.getSource().getValue()) {
            object.ReasonState = "Error"
        } else {
            object.ReasonState = "None"
            object.ReasonX = true;
        }

        if (event.getSource().getValue()) {
            object.EnabledSave = true;
        } else {
            object.EnabledSave = false;
        };

        context.getModel().refresh();
    }

    public updateIncidenceType(event: Select$ChangeEvent): void {
        const context = event.getSource().getBindingContext("form") as Context;
        let object = context.getObject() as any;
        object.TypeX = true;

        if (object.Reason) {
            object.EnabledSave = true;
        } else {
            object.EnabledSave = false;
        };

        context.getModel().refresh();
    }

    public onNavToOrderDetails(event: Event): void {
        const item = event.getSource() as ObjectListItem;
        const bindingContext = item.getBindingContext("northwind") as Context;
        const sEmployeeId = bindingContext.getProperty("EmployeeID").toString();
        const sOrderId = bindingContext.getProperty("OrderID").toString();

        // console.log(bindingContext.getPath());

        const viewModel = this.getModel("view") as JSONModel;
        viewModel.setProperty("/layout", "EndColumnFullScreen");

        const router = this.getRouter();
        router.navTo("RouteOrderDetails", {
            employeeId: sEmployeeId,
            orderId: sOrderId
        })
    }
}