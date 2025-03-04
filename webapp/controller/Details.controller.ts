import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import History from "sap/ui/core/routing/History";
import { ProductRating$ChangeEvent } from "../control/ProductRating";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import MessageToast from "sap/m/MessageToast";
import ProductRating from "../control/ProductRating";

/**
 * @namespace com.logali.invoices.controller
 */

export default class Details extends Controller {
    public onInit(): void | undefined {
        const router = (this.getOwnerComponent() as Component).getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this.onObjectMatched, this);
    }

    private onObjectMatched (event: Route$PatternMatchedEvent): void {
        const args = event.getParameter("arguments") as any;
        const path = args.path;
        const view = this.getView();

        (this.byId("rating") as ProductRating).reset();

        view?.bindElement({
            path: window.decodeURIComponent(path),
            model: "northwind"
        })
    }

    public onNavToBack (): void {
        const history = History.getInstance();
        const previousHash = history.getPreviousHash();

        if (previousHash!= undefined){
            window.history.go(-1); //funcion nativa de ts 
        }else{
            const router = (this.getOwnerComponent() as Component).getRouter();
            router.navTo("RouteApp")
        }
    }

    public onRatingChange (event: ProductRating$ChangeEvent) : void { 
        const value = event.getParameter("value");
        const resourceBundle = (this.getView()?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;

        MessageToast.show(resourceBundle.getText("ratingConfirmation", [value]) || 'No text defined');
    }

}