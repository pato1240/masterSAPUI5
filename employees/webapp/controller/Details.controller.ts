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
        aData.push({ Index: index + 1 });
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

        if (typeof bindingContext.getProperty("IncidenceId") === 'undefined') {
            //Creamos registro
            let object = {
                path: '/IncidentsSet',
                data: {
                    SapId: utils.getSapId(),
                    EmployeeId: (northwind?.getProperty("EmployeeID") as Number).toString(),
                    CreationDate: bindingContext.getProperty("CreationDate"),
                    Type: bindingContext.getProperty("Type"),
                    Reason: bindingContext.getProperty("Reason")
                }
            };
            await utils.crud('create', new JSONModel(object));
        } else {
            //Actualizamos registro
            const incidenceId = bindingContext.getProperty("IncidenceId");
            const sapId = utils.getSapId();
            const employeeId = (northwind?.getProperty("EmployeeID") as number).toString(); 

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
                }
            }
            await utils.crud('update', new JSONModel(object));
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

    public async onDeletePress (event: Button$PressEvent) : Promise<void> {
        const button = event.getSource() as Button;
        const toolbar = button.getParent() as Toolbar;
        const panel = toolbar.getParent() as Panel;

        const form = panel.getBindingContext("form");

        const incidenceId = form?.getProperty("IncidenceId");
        const sapId = form?.getProperty("SapId");
        const employeeId = form?.getProperty("EmployeeId");

        let object = {
            path: `/IncidentsSet(IncidenceId='${incidenceId}',SapId='${sapId}',EmployeeId='${employeeId}')`
        };

        const utils = new Utils(this);
        await utils.crud('delete', new JSONModel(object));
    }

    public updateIncidenceDate(event: DatePicker$ChangeEvent): void {
        const context = event.getSource().getBindingContext("form") as Context;
        let object = context.getObject() as any;
        object.CreationDateX = true;
    }

    public updateIncidenceReason(event: Input$LiveChangeEvent): void {
        const context = event.getSource().getBindingContext("form") as Context;
        let object = context.getObject() as any;
        object.ReasonX = true;
    }

    public updateIncidenceType(event: Select$ChangeEvent): void {
        const context = event.getSource().getBindingContext("form") as Context;
        let object = context.getObject() as any;
        object.TypeX = true;
    }
}