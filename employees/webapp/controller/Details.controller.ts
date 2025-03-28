import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import Panel from "sap/m/Panel";
import { Button$PressEvent } from "sap/m/Button";
import Button from "sap/m/Button";
import Context from "sap/ui/model/Context";
import Utils from "../utils/utils";

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

        view.bindElement({
            path: `/Employees(${id})/`,
            model: 'northwind'
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
        const northwind = this.getView().getBindingContext("northwind");

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
    }
}