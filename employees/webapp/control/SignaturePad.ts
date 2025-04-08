import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import SignaturePad from "signature_pad";

/**
 * @namespace com.logali.employees.control
 */

export default class Signature extends Control {
    constructor(idOrSettings?: string | $SignatureSettings);
    constructor(id?: string, settings?: $SignatureSettings);
    constructor(id?: string, settings?: $SignatureSettings) { super(id, settings); }

    private signaturePad : SignaturePad;

    static readonly metadata: MetadataOptions = {
        properties: {
            width: {
                type:'sap.ui.core.CSSSize',
                defaultValue: "320px"
            },
            height: {
                type: 'sap.ui.core.CSSSize',
                defaultValue: "150px"
            },
            backgroundColor: {
                type: 'sap.ui.core.CSSColor',
                defaultValue: "white"
            }
        }
    }

    init (): void {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        console.log(canvas);
        try {
            this.signaturePad = new SignaturePad(canvas);
        } catch(err) {
            console.log(err);
        }
    }

    renderer = {
        apiVersion: 4,
        render: (rm: RenderManager, control: Signature) => {
            rm.openStart("div", control);
            rm.class("signature");
            rm.openEnd();
                rm.openStart("canvas", control);
                rm.openEnd();
                rm.close("canvas")
            rm.close("div");
        }
    }
}