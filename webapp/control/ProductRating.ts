import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import RatingIndicator, {RatingIndicator$LiveChangeEvent} from "sap/m/RatingIndicator";
import Label from "sap/m/Label";
import Button from "sap/m/Button";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

/**
 * @namespace com.logali.invoices.control
 */

export default class ProductRating extends Control {
    
    constructor(idOrSettings?: string | $ProductRatingSettings);
    constructor(id?: string, settings?: $ProductRatingSettings);
    constructor(id?: string, settings?: $ProductRatingSettings) { super(id, settings); }

    static readonly metadata: MetadataOptions = {
        properties: {
            value: {
                type: 'float',
                defaultValue: 0
            }
        },
        aggregations: {
            _rating: {
                type: "sap.m.RatingIndicator",
                multiple: false, //cardinalidad
                visibility: "hidden"
            },
            _label: {
                type: "sap.m.Label",
                multiple: false,
                visibility: "hidden"
            },
            _button: {
                type:"sap.m.Button",
                multiple: false,
                visibility:"hidden"
            }
        },
        events: {
            change:{
                parameters: {
                    value: "float"
                }
            }
        }
    }

    init(): void | undefined {
        this.setAggregation("_rating", new RatingIndicator({
            iconSize: "2rem",
            value: this.getValue(),
            liveChange: this._onRate.bind(this)
        }));

        this.setAggregation("_label",new Label({
            text: "{i18n>productRatingLabelInitial}"
        }).addStyleClass("sapUiSmallMargin"));

        this.setAggregation("_button", new Button({
            text: "{i18n>productRatingButton}",
            press: this._onSubmit.bind(this)
        }).addStyleClass("sapUiSmallMarginTopBottom"));
    }

    renderer = {
        apiVersion: 4,
        render: (rm:RenderManager, control: ProductRating) => {
            rm.openStart("div", control);
            rm.class("productRating")
            rm.openEnd();
            rm.renderControl(<Control> control.getAggregation("_rating"));
            rm.renderControl(<Control> control.getAggregation("_label"));
            rm.renderControl(<Control> control.getAggregation("_button"));
            rm.close("div");
        }
    }

    _onRate (event: RatingIndicator$LiveChangeEvent): void {
        const resourceBundle = (this.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;
        const value = event.getParameter("value");
        const maxValue = (event.getSource() as RatingIndicator).getMaxValue();

        this.setProperty("value",value);
        (this.getAggregation("_label") as Label).setText(resourceBundle.getText("productRatingLabelIndicator",[value, maxValue]));
        (this.getAggregation("_label") as Label).setDesign("Bold");

    }

    _onSubmit (): void {
        const resourceBundle = (this.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;

        (this.getAggregation("_rating") as RatingIndicator).setEnabled(false);
        (this.getAggregation("_button") as Button).setEnabled(false);
        (this.getAggregation("_label")as Label).setText(resourceBundle.getText("productRatingLabelFinal"));

        this.fireEvent("change",{
            value: this.getValue()
        })

    }

    setValue (value: "float") : ProductRating {
        this.setProperty("value",value);
        (this.getAggregation("_rating") as RatingIndicator).setValue(value);
        return this;
    }

    reset () : void {
        const resourceBundle = (this.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;

        (this.getAggregation("_rating") as RatingIndicator).setEnabled(true);
        (this.getAggregation("_button") as Button).setEnabled(true);
        (this.getAggregation("_label")as Label).setText(resourceBundle.getText("productRatingLabelInitial"));
        (this.getAggregation("_label") as Label).setDesign("Standard");

        this.setValue(0);
    }
}