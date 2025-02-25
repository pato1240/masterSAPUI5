import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";

/**
 * @namespace com.logali.invoices.controller
 */

export default class Details extends Controller {
    public onInit(): void | undefined {
        const router = (this.getOwnerComponent() as Component).getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this.onObjectMatched, this);
    }

    private onObjectMatched(event: Route$PatternMatchedEvent): void {
        const args = event.getParameter("arguments") as any;
        const path = args.path;
        const view = this.getView();

        view?.bindElement({
            path: window.decodeURIComponent(path),
            model: "northwind"
        })
    }
}