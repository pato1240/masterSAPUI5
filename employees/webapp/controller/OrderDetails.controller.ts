import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.logali.employees.controller
 */

export default class OrderDetails extends BaseController {
    public onInit(): void | undefined {
        const router = this.getRouter();
        router.getRoute("RouteOrderDetails")?.attachPatternMatched(this.onObjectMatched.bind(this));
    }

    private onObjectMatched(event: Route$PatternMatchedEvent): void {
        const args = event.getParameter("arguments") as any;
        const employeeId = args.employeeId as string;
        const orderId = args.orderId as string;
        const view = this.getView() as View;
        view?.bindElement({
            path:`/Orders(${orderId})`,
            model: "northwind",
            events: {
                change: function() {
                },
                dataRequested: function() {
                    view.setBusy(true);
                },
                dataReceived: function() {
                    view.setBusy(false);
                }
            }
        })
    }

    public onNavBackToDetails () {
        const router = this.getRouter();
        const viewModel = this.getModel("view") as JSONModel;
        viewModel.setProperty("/layout", "TwoColumnsMidExpanded");
        router.navTo("RouteDetails");
    }
}