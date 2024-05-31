# -*- coding: utf-8 -*-
# from odoo import http


# class MohDashboard(http.Controller):
#     @http.route('/moh_dashboard/moh_dashboard', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/moh_dashboard/moh_dashboard/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('moh_dashboard.listing', {
#             'root': '/moh_dashboard/moh_dashboard',
#             'objects': http.request.env['moh_dashboard.moh_dashboard'].search([]),
#         })

#     @http.route('/moh_dashboard/moh_dashboard/objects/<model("moh_dashboard.moh_dashboard"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('moh_dashboard.object', {
#             'object': obj
#         })
