odoo.define('moh_dashboard.ks_topic_preview', function(require) {
    "use strict";

    var registry = require('web.field_registry');
    var AbstractField = require('web.AbstractField');
    var core = require('web.core');

    var QWeb = core.qweb;
    var field_utils = require('web.field_utils');

    var KsTopicViewPreview = AbstractField.extend({
        supportedFieldTypes: ['char'],

        resetOnAnyFieldChange: true,

        init: function(parent, state, params) {
            this._super.apply(this, arguments);
            this.state = {};
        },

        _render: function() {
            var self = this;
            this.$el.empty();
            var rec = self.recordData;
            if (rec.ks_dashboard_item_type === 'ks_topic') {
                self.ksRenderTopicView(rec);
            }
        },

        _ks_get_rgba_format: function(val) {
            var rgba = val.split(',')[0].match(/[A-Za-z0-9]{2}/g);
            rgba = rgba.map(function(v) {
                return parseInt(v, 16);
            }).join(",");
            return "rgba(" + rgba + "," + val.split(',')[1] + ")";
        },

        ksRenderTopicView: function(rec) {
            var self = this;
            var ks_header_color = self._ks_get_rgba_format(rec.ks_header_bg_color);
            var ks_font_color = self._ks_get_rgba_format(rec.ks_font_color);
            var ks_rgba_button_color = self._ks_get_rgba_format(rec.ks_button_color);
            var list_topic_data = {};

            if (rec.ks_topic_data) {
                list_topic_data = JSON.parse(rec.ks_topic_data);
            }

            var $topicViewContainer = $(QWeb.render('ks_topic_container', {
                ks_topic_view_name: rec.name ? rec.name : 'Name',
                topic_view_data: list_topic_data,
            }));

            $topicViewContainer.find('.ks_card_header').addClass('ks_bg_to_color').css({"background-color": ks_header_color});
            $topicViewContainer.find('.ks_card_header').addClass('ks_bg_to_color').css({"color": ks_font_color + ' !important'});
            $topicViewContainer.find('.ks_li_tab').addClass('ks_bg_to_color').css({"color": ks_font_color + ' !important'});
            $topicViewContainer.find('.ks_chart_heading').addClass('ks_bg_to_color').css({"color": ks_font_color + ' !important'});

            this.$el.append($topicViewContainer);
        },
    });

    registry.add('ks_dashboard_topic_preview', KsTopicViewPreview);

    return {
        KsTopicViewPreview: KsTopicViewPreview,
    };
});
