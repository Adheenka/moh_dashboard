odoo.define("pos_inheritence.WBSampleButton", function (require) {
    "use strict";

    const PosComponent = require("point_of_sale.PosComponent");
    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");

    const { useListener } = require('web.custom_hooks');

    const { Gui } = require("point_of_sale.Gui");


    class WBSampleButton extends PosComponent {
    setup() {
             super.setup();
             useListener("click", this.WBSampleButton_click);
        }

        WBSampleButton_click() {
             console.log("Hello, this is a button click event pressed");
                    }
        }

    WBSampleButton.template = "WBSampleButton";

    ProductScreen.addControlButton({
        component: WBSampleButton,
        condition: function() {
            // You can add a condition here to control when the button should appear.
            return true;
        },
    });

    Registries.Component.add(WBSampleButton);

    return WBSampleButton;
});