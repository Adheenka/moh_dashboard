odoo.define('moh_dashboard.topics_dashboard_ninja_templates', function (require) {
    "use strict";

    var KsDashboard = require('ks_dashboard_ninja.ks_dashboard');
    var core = require('web.core');
    var Dialog = require('web.Dialog');
    var QWeb = core.qweb;
    var _t = core._t;

    return KsDashboard.include({
        events: _.extend({}, KsDashboard.prototype.events, {
            'click .ks_edit_topic_content': '_onKsEditTopic',
            'click .ks_delete_topic_content': '_onKsDeleteTopicContent',
            'click .header_add_topic_btn': '_onKsAddTopic',
            'click .ks_li_topic_tab': '_onKsUpdateTopicAddButtonAttribute',
            'click .ks_topic_item_active_handler': '_onKsTopicActiveHandler',
        }),

        ksRenderDashboardItems: function (items) {
            var self = this;
            self.$el.find('.print-dashboard-btn').addClass("ks_pro_print_hide");

            if (self.ks_dashboard_data.ks_gridstack_config) {
                self.gridstackConfig = JSON.parse(self.ks_dashboard_data.ks_gridstack_config);
            }

            for (var i = 0; i < items.length; i++) {
                if (self.grid) {
                    if (items[i].ks_dashboard_item_type === 'ks_topic') {
                        var $topicPreview = self.ksRenderTopicDashboardView(items[i]);
                        if (items[i].id in self.gridstackConfig) {
                            self.grid.addWidget($topicPreview[0], {
                                x: self.gridstackConfig[items[i].id].x,
                                y: self.gridstackConfig[items[i].id].y,
                                w: self.gridstackConfig[items[i].id].w,
                                h: self.gridstackConfig[items[i].id].h,
                                autoPosition: false,
                                minW: 4,
                                maxW: null,
                                minH: 3,
                                maxH: null,
                                id: items[i].id
                            });
                        } else {
                            self.grid.addWidget($topicPreview[0], {
                                x: 0,
                                y: 0,
                                w: 5,
                                h: 4,
                                autoPosition: true,
                                minW: 4,
                                maxW: null,
                                minH: 3,
                                maxH: null,
                                id: items[i].id
                            });
                        }
                    } else {
                        self._super.apply(this, arguments);
                    }
                }
            }
        },

        ksRenderTopicDashboardView: function (item) {
            var self = this;
            var item_title = item.name;
            var item_id = item.id;
            var list_topic_data = JSON.parse(item.ks_topic_data);
            var ks_header_color = self._ks_get_rgba_format(item.ks_header_bg_color);
            var ks_font_color = self._ks_get_rgba_format(item.ks_font_color);
            var ks_rgba_button_color = self._ks_get_rgba_format(item.ks_button_color);
            var $ksItemContainer = self.ksRenderTopicView(item);
            var $ks_gridstack_container = $(QWeb.render('ks_topic_dashboard_container', {
                ks_chart_title: item_title,
                ksIsDashboardManager: self.ks_dashboard_data.ks_dashboard_manager,
                ks_dashboard_list: self.ks_dashboard_data.ks_dashboard_list,
                item_id: item_id,
                topic_view_data: list_topic_data,
                ks_rgba_button_color: ks_rgba_button_color,
            })).addClass('ks_dashboarditem_id');

            $ks_gridstack_container.find('.ks_card_header').css({ "background-color": ks_header_color, "color": ks_font_color + ' !important' });
            $ks_gridstack_container.find('.ks_li_topic_tab').css({ "color": ks_font_color + ' !important' });
            $ks_gridstack_container.find('.ks_list_view_heading').css({ "color": ks_font_color + ' !important' });
            $ks_gridstack_container.find('.ks_topic_card_body').append($ksItemContainer);

            return $ks_gridstack_container;
        },

        ksRenderTopicView: function (item) {
            var self = this;
            var item_id = item.id;
            var list_topic_data = JSON.parse(item.ks_topic_data);
            var $topicViewContainer = $(QWeb.render('ks_topic_dashboard_inner_container', {
                ks_topic_view_name: "Topics",
                topic_view_data: list_topic_data,
                item_id: item_id,
            }));
            return $topicViewContainer;
        },

        _onKsEditTopic: function (e) {
            var self = this;
            var ks_topic_id = e.currentTarget.dataset.contentId;
            var ks_item_id = e.currentTarget.dataset.itemId;
            var ks_section_id = e.currentTarget.dataset.sectionId;
            var ks_description = $(e.currentTarget.parentElement.parentElement).find('.ks_description').attr('value');

            var $content = "<div><input type='text' class='ks_description' value='" + ks_description + "' placeholder='Topic'></input></div>"
            var dialog = new Dialog(this, {
                title: _t('Edit Topic'),
                size: 'medium',
                $content: $content,
                buttons: [
                    {
                        text: 'Save',
                        classes: 'btn-primary',
                        click: function (e) {
                            var content = $(e.currentTarget.parentElement.parentElement).find('.ks_description').val();
                            if (content.length === 0) {
                                content = ks_description;
                            }
                            self.onSaveTopic(content, parseInt(ks_topic_id), parseInt(ks_item_id), parseInt(ks_section_id));
                        },
                        close: true,
                    },
                    {
                        text: _t('Close'),
                        classes: 'btn-secondary o_form_button_cancel',
                        close: true,
                    }
                ],
            });
            dialog.open();
        },

        onSaveTopic: function (content, ks_topic_id, ks_item_id, ks_section_id) {
            var self = this;
            this._rpc({
                model: 'ks.topic.description',
                method: 'write',
                args: [ks_topic_id, {
                    "ks_description": content
                }],
            }).then(function () {
                self.ksFetchUpdateItem(ks_item_id).then(function () {
                    $(".ks_li_topic_tab[data-item-id=" + ks_item_id + "]").removeClass('active');
                    $(".ks_li_topic_tab[data-section-id=" + ks_section_id + "]").addClass('active');
                    $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
                    $(".ks_tab_section[data-section-id=" + ks_section_id + "]").addClass('active show');
                    $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
                });
            });
        },

        _onKsDeleteTopicContent: function (e) {
            var self = this;
            var ks_topic_id = e.currentTarget.dataset.contentId;
            var ks_item_id = e.currentTarget.dataset.itemId;
            var ks_section_id = e.currentTarget.dataset.sectionId;

            Dialog.confirm(this, (_t("Are you sure you want to remove this topic?")), {
                confirm_callback: function () {
                    self._rpc({
                        model: 'ks.topic.description',
                        method: 'unlink',
                        args: [parseInt(ks_topic_id)],
                    }).then(function () {
                        self.ksFetchUpdateItem(ks_item_id).then(function () {
                            $(".ks_li_topic_tab[data-item-id=" + ks_item_id + "]").removeClass('active');
                            $(".ks_li_topic_tab[data-section-id=" + ks_section_id + "]").addClass('active');
                            $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
                            $(".ks_tab_section[data-section-id=" + ks_section_id + "]").addClass('active show');
                            $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
                        });
                    });
                },
            });
        },

        _onKsAddTopic: function (e) {
            var self = this;
            var ks_section_id = e.currentTarget.dataset.sectionId;
            var ks_item_id = e.currentTarget.dataset.itemId;
            var $content = "<div><input type='text' class='ks_section' placeholder='Topic' required></input></div>"
            var dialog = new Dialog(this, {
                title: _t('Add Topic'),
                size: 'medium',
                $content: $content,
                buttons: [
                    {
                        text: _t('Add'),
                        classes: 'btn-primary',
                        click: function (e) {
                            var section = $(e.currentTarget.parentElement.parentElement).find('.ks_section').val();
                            self.onAddTopic(section, parseInt(ks_section_id), parseInt(ks_item_id));
                        },
                        close: true,
                    },
                    {
                        text: _t('Close'),
                        classes: 'btn-secondary o_form_button_cancel',
                        close: true,
                    }
                ],
            });
            dialog.open();
        },

        onAddTopic: function (content, ks_section_id, ks_item_id) {
            var self = this;
            this._rpc({
                model: 'ks.topic.description',
                method: 'create',
                args: [{
                    'ks_section': content,
                    'ks_item_id': ks_item_id,
                    'ks_section_id': ks_section_id,
                }],
            }).then(function () {
                self.ksFetchUpdateItem(ks_item_id).then(function () {
                    $(".ks_li_topic_tab[data-item-id=" + ks_item_id + "]").removeClass('active');
                    $(".ks_li_topic_tab[data-section-id=" + ks_section_id + "]").addClass('active');
                    $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
                    $(".ks_tab_section[data-section-id=" + ks_section_id + "]").addClass('active show');
                    $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
                });
            });
        },

        _onKsUpdateTopicAddButtonAttribute: function (e) {
            var self = this;
            var ks_section_id = e.currentTarget.dataset.sectionId;
            var ks_item_id = e.currentTarget.dataset.itemId;
            $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
        },

        _onKsTopicActiveHandler: function (e) {
            var self = this;
            var ks_item_id = e.currentTarget.dataset.itemId;
            $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
            $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active');
            $(e.currentTarget).parent().parent().addClass('active show');
        },

    });
});



//# gpt code


//odoo.define('moh_dashboard.topics_dashboard_ninja_templates', function (require) {
//    "use strict";
//
//    var KsDashboard = require('ks_dashboard_ninja.ks_dashboard');
//    var core = require('web.core');
//    var Dialog = require('web.Dialog');
//    var QWeb = core.qweb;
//    var _t = core._t;
//
//    return KsDashboard.include({
//        events: _.extend({}, KsDashboard.prototype.events, {
//            'click .ks_edit_topic_content': '_onKsEditTopic',
//            'click .ks_delete_topic_content': '_onKsDeleteTopicContent',
//            'click .header_add_topic_btn': '_onKsAddTopic',
//            'click .ks_li_topic_tab': '_onKsUpdateTopicAddButtonAttribute',
//            'click .ks_topic_item_active_handler': '_onKsTopicActiveHandler',
//        }),
//
//        ksRenderDashboardItems: function(items) {
//            var self = this;
//            self.$el.find('.print-dashboard-btn').addClass("ks_pro_print_hide");
//
//            if (self.ks_dashboard_data.ks_gridstack_config) {
//                self.gridstackConfig = JSON.parse(self.ks_dashboard_data.ks_gridstack_config);
//            }
//
//            for (var i = 0; i < items.length; i++) {
//                if (self.grid) {
//                    if (items[i].ks_dashboard_item_type === 'ks_topic') {
//                        var $topicPreview = self.ksRenderTopicDashboardView(items[i]);
//                        if (items[i].id in self.gridstackConfig) {
//                            self.grid.addWidget($topicPreview[0], {
//                                x: self.gridstackConfig[items[i].id].x,
//                                y: self.gridstackConfig[items[i].id].y,
//                                w: self.gridstackConfig[items[i].id].w,
//                                h: self.gridstackConfig[items[i].id].h,
//                                autoPosition: false,
//                                minW: 4,
//                                maxW: null,
//                                minH: 3,
//                                maxH: null,
//                                id: items[i].id
//                            });
//                        } else {
//                            self.grid.addWidget($topicPreview[0], {
//                                x: 0,
//                                y: 0,
//                                w: 5,
//                                h: 4,
//                                autoPosition: true,
//                                minW: 4,
//                                maxW: null,
//                                minH: 3,
//                                maxH: null,
//                                id: items[i].id
//                            });
//                        }
//                    } else {
//                        self._super.apply(this, arguments);
//                    }
//                }
//            }
//        },
//
//        ksRenderTopicDashboardView: function(item) {
//            var self = this;
//            var item_title = item.name;
//            var item_id = item.id;
//            var list_topic_data = JSON.parse(item.ks_topic_data);
//            var ks_header_color = self._ks_get_rgba_format(item.ks_header_bg_color);
//            var ks_font_color = self._ks_get_rgba_format(item.ks_font_color);
//            var ks_rgba_button_color = self._ks_get_rgba_format(item.ks_button_color);
//            var $ksItemContainer = self.ksRenderTopicView(item);
//            var $ks_gridstack_container = $(QWeb.render('ks_topic_dashboard_container', {
//                ks_chart_title: item_title,
//                ksIsDashboardManager: self.ks_dashboard_data.ks_dashboard_manager,
//                ks_dashboard_list: self.ks_dashboard_data.ks_dashboard_list,
//                item_id: item_id,
//                topic_view_data: list_topic_data,
//                ks_rgba_button_color: ks_rgba_button_color,
//            })).addClass('ks_dashboarditem_id');
//
//            $ks_gridstack_container.find('.ks_card_header').css({"background-color": ks_header_color, "color": ks_font_color + ' !important' });
//            $ks_gridstack_container.find('.ks_li_topic_tab').css({"color": ks_font_color + ' !important' });
//            $ks_gridstack_container.find('.ks_list_view_heading').css({"color": ks_font_color + ' !important' });
//            $ks_gridstack_container.find('.ks_topic_card_body').append($ksItemContainer);
//
//            return $ks_gridstack_container;
//        },
//
//        ksRenderTopicView: function(item) {
//            var self = this;
//            var item_id = item.id;
//            var list_topic_data = JSON.parse(item.ks_topic_data);
//            var $topicViewContainer = $(QWeb.render('ks_topic_dashboard_inner_container', {
//                ks_topic_view_name: "Topics",
//                topic_view_data: list_topic_data,
//                item_id: item_id,
//            }));
//            return $topicViewContainer;
//        },
//
//        _onKsEditTopic: function(e) {
//            var self = this;
//            var ks_topic_id = e.currentTarget.dataset.contentId;
//            var ks_item_id = e.currentTarget.dataset.itemId;
//            var ks_section_id = e.currentTarget.dataset.sectionId;
//            var ks_description = $(e.currentTarget.parentElement.parentElement).find('.ks_description').attr('value');
//
//            var $content = "<div><input type='text' class='ks_description' value='"+ ks_description +"' placeholder='Topic'></input></div>"
//            var dialog = new Dialog(this, {
//                title: _t('Edit Topic'),
//                size: 'medium',
//                $content: $content,
//                buttons: [
//                    {
//                        text: 'Save',
//                        classes: 'btn-primary',
//                        click: function(e) {
//                            var content = $(e.currentTarget.parentElement.parentElement).find('.ks_description').val();
//                            if (content.length === 0) {
//                                content = ks_description;
//                            }
//                            self.onSaveTopic(content, parseInt(ks_topic_id), parseInt(ks_item_id), parseInt(ks_section_id));
//                        },
//                        close: true,
//                    },
//                    {
//                        text: _t('Close'),
//                        classes: 'btn-secondary o_form_button_cancel',
//                        close: true,
//                    }
//                ],
//            });
//            dialog.open();
//        },
//
//        onSaveTopic: function(content, ks_topic_id, ks_item_id, ks_section_id) {
//            var self = this;
//            this._rpc({
//                model: 'ks.topic.description',
//                method: 'write',
//                args: [ks_topic_id, {
//                    "ks_description": content
//                }],
//            }).then(function() {
//                self.ksFetchUpdateItem(ks_item_id).then(function() {
//                    $(".ks_li_topic_tab[data-item-id=" + ks_item_id + "]").removeClass('active');
//                    $(".ks_li_topic_tab[data-section-id=" + ks_section_id + "]").addClass('active');
//                    $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
//                    $(".ks_tab_section[data-section-id=" + ks_section_id + "]").addClass('active show');
//                    $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
//                });
//            });
//        },
//
//        _onKsDeleteTopicContent: function(e) {
//            var self = this;
//            var ks_topic_id = e.currentTarget.dataset.contentId;
//            var ks_item_id = e.currentTarget.dataset.itemId;
//            var ks_section_id = e.currentTarget.dataset.sectionId;
//
//            Dialog.confirm(this, (_t("Are you sure you want to remove this topic?")), {
//                confirm_callback: function() {
//                    self._rpc({
//                        model: 'ks.topic.description',
//                        method: 'unlink',
//                        args: [parseInt(ks_topic_id)],
//                    }).then(function() {
//                        self.ksFetchUpdateItem(ks_item_id).then(function() {
//                            $(".ks_li_topic_tab[data-item-id=" + ks_item_id + "]").removeClass('active');
//                            $(".ks_li_topic_tab[data-section-id=" + ks_section_id + "]").addClass('active');
//                            $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
//                            $(".ks_tab_section[data-section-id=" + ks_section_id + "]").addClass('active show');
//                            $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
//                        });
//                    });
//                },
//            });
//        },
//
//        _onKsAddTopic: function(e) {
//            var self = this;
//            var ks_section_id = e.currentTarget.dataset.sectionId;
//            var ks_item_id = e.currentTarget.dataset.itemId;
//            var $content = "<div><input type='text' class='ks_section' placeholder='Topic' required></input></div>"
//            var dialog = new Dialog(this, {
//                title: _t('New Topic'),
//                $content: $content,
//                size: 'medium',
//                buttons: [
//                    {
//                        text: 'Save',
//                        classes: 'btn-primary',
//                        click: function(e) {
//                            var content = $(e.currentTarget.parentElement.parentElement).find('.ks_section').val();
//                            if (content.length === 0) {
//                                // Handle empty input
//                            } else {
//                                self._onCreateTopic(content, parseInt(ks_section_id), parseInt(ks_item_id));
//                            }
//                        },
//                        close: true,
//                    },
//                    {
//                        text: _t('Close'),
//                        classes: 'btn-secondary o_form_button_cancel',
//                        close: true,
//                    }
//                ],
//            });
//            dialog.open();
//        },
//
//        _onCreateTopic: function(content, ks_section_id, ks_item_id) {
//            var self = this;
//            this._rpc({
//                model: 'ks.topic.description',
//                method: 'create',
//                args: [{
//                    ks_topic_header_id: ks_section_id,
//                    ks_description: content,
//                }],
//            }).then(function() {
//                self.ksFetchUpdateItem(ks_item_id).then(function() {
//                    $(".ks_li_topic_tab[data-item-id=" + ks_item_id + "]").removeClass('active');
//                    $(".ks_li_topic_tab[data-section-id=" + ks_section_id + "]").addClass('active');
//                    $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
//                    $(".ks_tab_section[data-section-id=" + ks_section_id + "]").addClass('active show');
//                    $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
//                });
//            });
//        },
//
//        _onKsUpdateTopicAddButtonAttribute: function(e) {
//            var item_id = e.currentTarget.dataset.itemId;
//            var sectionId = e.currentTarget.dataset.sectionId;
//            $(".header_add_topic_btn[data-item-id=" + item_id + "]").attr('data-section-id', sectionId);
//        },
//
//        _onKsTopicActiveHandler: function(e) {
//            var self = this;
//            var ks_item_id = e.currentTarget.dataset.itemId;
//            var topic_id = e.currentTarget.dataset.contentId;
//            var ks_section_id = e.currentTarget.dataset.sectionId;
//            var ks_value = e.currentTarget.dataset.valueId;
//            ks_value = ks_value === 'True' ? false : true;
//
//            self.topic_id = topic_id;
//            this._rpc({
//                model: 'ks.topic.description',
//                method: 'write',
//                args: [topic_id, {
//                    "ks_active": ks_value
//                }],
//            }).then(function() {
//                self.ksFetchUpdateItem(ks_item_id).then(function() {
//                    $(".ks_li_topic_tab[data-item-id=" + ks_item_id + "]").removeClass('active');
//                    $(".ks_li_topic_tab[data-section-id=" + ks_section_id + "]").addClass('active');
//                    $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
//                    $(".ks_tab_section[data-section-id=" + ks_section_id + "]").addClass('active show');
//                    $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
//                });
//            });
//        }
//    });
//});


//# gokul;

//odoo.define('moh_dashboard.topics_dashboard_ninja_templates', function (require) {
//    "use strict";
//
//    var KsDashboard = require('ks_dashboard_ninja.ks_dashboard');
//    var core = require('web.core');
//    var Dialog = require('web.Dialog');
//    var QWeb = core.qweb;
//    var _t = core._t;
//
//    return KsDashboard.include({
//        events: _.extend({}, KsDashboard.prototype.events, {
//            'click .ks_edit_topic_content': '_onKsEditTopic',
//            'click .ks_delete_topic_content': '_onKsDeleteTopicContent',
//            'click .header_add_topic_btn': '_onKsAddTopic',
//            'click .ks_li_topic_tab': '_onKsUpdateTopicAddButtonAttribute',
//            'click .ks_topic_item_active_handler': '_onKsTopicActiveHandler',
//        }),
//
//        ksRenderDashboardItems: function (items) {
//            var self = this;
//            self.$el.find('.print-dashboard-btn').addClass("ks_pro_print_hide");
//
//            if (self.ks_dashboard_data.ks_gridstack_config) {
//                self.gridstackConfig = JSON.parse(self.ks_dashboard_data.ks_gridstack_config);
//            }
//
//            for (var i = 0; i < items.length; i++) {
//                if (self.grid) {
//                    if (items[i].ks_dashboard_item_type === 'ks_topic') {
//                        var $topicPreview = self.ksRenderTopicDashboardView(items[i]);
//                        if (items[i].id in self.gridstackConfig) {
//                            self.grid.addWidget($topicPreview[0], {
//                                x: self.gridstackConfig[items[i].id].x,
//                                y: self.gridstackConfig[items[i].id].y,
//                                w: self.gridstackConfig[items[i].id].w,
//                                h: self.gridstackConfig[items[i].id].h,
//                                autoPosition: false,
//                                minW: 4,
//                                maxW: null,
//                                minH: 3,
//                                maxH: null,
//                                id: items[i].id
//                            });
//                        } else {
//                            self.grid.addWidget($topicPreview[0], {
//                                x: 0,
//                                y: 0,
//                                w: 5,
//                                h: 4,
//                                autoPosition: true,
//                                minW: 4,
//                                maxW: null,
//                                minH: 3,
//                                maxH: null,
//                                id: items[i].id
//                            });
//                        }
//                    } else {
//                        self._super.apply(this, arguments);
//                    }
//                }
//            }
//        },
//
//        ksRenderTopicDashboardView: function (item) {
//            var self = this;
//            var item_title = item.name;
//            var item_id = item.id;
//            var list_topic_data = JSON.parse(item.ks_topic_data);
//            var ks_header_color = self._ks_get_rgba_format(item.ks_header_bg_color);
//            var ks_font_color = self._ks_get_rgba_format(item.ks_font_color);
//            var ks_rgba_button_color = self._ks_get_rgba_format(item.ks_button_color);
//            var $ksItemContainer = self.ksRenderTopicView(item);
//            var $ks_gridstack_container = $(QWeb.render('ks_topic_dashboard_container', {
//                ks_chart_title: item_title,
//                ksIsDashboardManager: self.ks_dashboard_data.ks_dashboard_manager,
//                ks_dashboard_list: self.ks_dashboard_data.ks_dashboard_list,
//                item_id: item_id,
//                topic_view_data: list_topic_data,
//                ks_rgba_button_color: ks_rgba_button_color,
//            })).addClass('ks_dashboarditem_id');
//
//            $ks_gridstack_container.find('.ks_card_header').css({ "background-color": ks_header_color, "color": ks_font_color + ' !important' });
//            $ks_gridstack_container.find('.ks_li_topic_tab').css({ "color": ks_font_color + ' !important' });
//            $ks_gridstack_container.find('.ks_list_view_heading').css({ "color": ks_font_color + ' !important' });
//            $ks_gridstack_container.find('.ks_topic_card_body').append($ksItemContainer);
//
//            return $ks_gridstack_container;
//        },
//
//        ksRenderTopicView: function (item) {
//            var self = this;
//            var item_id = item.id;
//            var list_topic_data = JSON.parse(item.ks_topic_data);
//            var $topicViewContainer = $(QWeb.render('ks_topic_dashboard_inner_container', {
//                ks_topic_view_name: "Topics",
//                topic_view_data: list_topic_data,
//                item_id: item_id,
//            }));
//            return $topicViewContainer;
//        },
//
//        _onKsEditTopic: function (e) {
//            var self = this;
//            var ks_topic_id = e.currentTarget.dataset.contentId;
//            var ks_item_id = e.currentTarget.dataset.itemId;
//            var ks_section_id = e.currentTarget.dataset.sectionId;
//            var ks_description = $(e.currentTarget.parentElement.parentElement).find('.ks_description').attr('value');
//
//            var $content = "<div><input type='text' class='ks_description' value='" + ks_description + "' placeholder='Topic'></input></div>"
//            var dialog = new Dialog(this, {
//                title: _t('Edit Topic'),
//                size: 'medium',
//                $content: $content,
//                buttons: [
//                    {
//                        text: 'Save',
//                        classes: 'btn-primary',
//                        click: function (e) {
//                            var content = $(e.currentTarget.parentElement.parentElement).find('.ks_description').val();
//                            if (content.length === 0) {
//                                content = ks_description;
//                            }
//                            self.onSaveTopic(content, parseInt(ks_topic_id), parseInt(ks_item_id), parseInt(ks_section_id));
//                        },
//                        close: true,
//                    },
//                    {
//                        text: _t('Close'),
//                        classes: 'btn-secondary o_form_button_cancel',
//                        close: true,
//                    }
//                ],
//            });
//            dialog.open();
//        },
//
//        onSaveTopic: function (content, ks_topic_id, ks_item_id, ks_section_id) {
//            var self = this;
//            this._rpc({
//                model: 'ks.topic.description',
//                method: 'write',
//                args: [ks_topic_id, {
//                    "ks_description": content
//                }],
//            }).then(function () {
//                self.ksFetchUpdateItem(ks_item_id).then(function () {
//                    $(".ks_li_topic_tab[data-item-id=" + ks_item_id + "]").removeClass('active');
//                    $(".ks_li_topic_tab[data-section-id=" + ks_section_id + "]").addClass('active');
//                    $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
//                    $(".ks_tab_section[data-section-id=" + ks_section_id + "]").addClass('active show');
//                    $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
//                });
//            });
//        },
//
//        _onKsDeleteTopicContent: function (e) {
//            var self = this;
//            var ks_topic_id = e.currentTarget.dataset.contentId;
//            var ks_item_id = e.currentTarget.dataset.itemId;
//            var ks_section_id = e.currentTarget.dataset.sectionId;
//
//            Dialog.confirm(this, (_t("Are you sure you want to remove this topic?")), {
//                confirm_callback: function () {
//                    self._rpc({
//                        model: 'ks.topic.description',
//                        method: 'unlink',
//                        args: [parseInt(ks_topic_id)],
//                    }).then(function () {
//                        self.ksFetchUpdateItem(ks_item_id).then(function () {
//                            $(".ks_li_topic_tab[data-item-id=" + ks_item_id + "]").removeClass('active');
//                            $(".ks_li_topic_tab[data-section-id=" + ks_section_id + "]").addClass('active');
//                            $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
//                            $(".ks_tab_section[data-section-id=" + ks_section_id + "]").addClass('active show');
//                            $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
//                        });
//                    });
//                },
//            });
//        },
//
//        _onKsAddTopic: function (e) {
//            var self = this;
//            var ks_section_id = e.currentTarget.dataset.sectionId;
//            var ks_item_id = e.currentTarget.dataset.itemId;
//            var $content = "<div><input type='text' class='ks_section' placeholder='Topic' required></input></div>"
//            var dialog = new Dialog(this, {
//                title: _t('Add Topic'),
//                size: 'medium',
//                $content: $content,
//                buttons: [
//                    {
//                        text: _t('Add'),
//                        classes: 'btn-primary',
//                        click: function (e) {
//                            var section = $(e.currentTarget.parentElement.parentElement).find('.ks_section').val();
//                            self.onAddTopic(section, parseInt(ks_section_id), parseInt(ks_item_id));
//                        },
//                        close: true,
//                    },
//                    {
//                        text: _t('Close'),
//                        classes: 'btn-secondary o_form_button_cancel',
//                        close: true,
//                    }
//                ],
//            });
//            dialog.open();
//        },
//
//        onAddTopic: function (content, ks_section_id, ks_item_id) {
//            var self = this;
//            this._rpc({
//                model: 'ks.topic.description',
//                method: 'create',
//                args: [{
//                    'ks_section': content,
//                    'ks_item_id': ks_item_id,
//                    'ks_section_id': ks_section_id,
//                }],
//            }).then(function () {
//                self.ksFetchUpdateItem(ks_item_id).then(function () {
//                    $(".ks_li_topic_tab[data-item-id=" + ks_item_id + "]").removeClass('active');
//                    $(".ks_li_topic_tab[data-section-id=" + ks_section_id + "]").addClass('active');
//                    $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
//                    $(".ks_tab_section[data-section-id=" + ks_section_id + "]").addClass('active show');
//                    $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
//                });
//            });
//        },
//
//        _onKsUpdateTopicAddButtonAttribute: function (e) {
//            var self = this;
//            var ks_section_id = e.currentTarget.dataset.sectionId;
//            var ks_item_id = e.currentTarget.dataset.itemId;
//            $(".header_add_topic_btn[data-item-id=" + ks_item_id + "]").attr('data-section-id', ks_section_id);
//        },
//
//        _onKsTopicActiveHandler: function (e) {
//            var self = this;
//            var ks_item_id = e.currentTarget.dataset.itemId;
//            $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active show');
//            $(".ks_tab_section[data-item-id=" + ks_item_id + "]").removeClass('active');
//            $(e.currentTarget).parent().parent().addClass('active show');
//        },
//
//    });
//});
