from odoo import models, fields, api

class KsDashboardNinjaItems(models.Model):
    _inherit = 'ks_dashboard_ninja.item'


    # New fields for the 'Topics' section
    topic_name = fields.Char(string="Topic Name")
    company_name = fields.Char(string="Company Name", default=lambda self: self.env.user.company_id.name)
    type = fields.Selection([('topic', 'Topic')], string="Type", default='topic')

    # # ks_dashboard_item_type = fields.Selection(
    # #     selection_add=[('ks_topic', 'Topics')],
    # # )
    # @api.depends('ks_dn_header_lines', 'ks_dashboard_item_type')
    # def ks_get_to_do_view_data(self):
    #     for rec in self:
    #         ks_to_do_data = rec._ksGetToDOData()
    #         rec.ks_to_do_data = ks_to_do_data

    ks_dashboard_item_type = fields.Selection([('ks_tile', 'Tile'),
                                               ('ks_bar_chart', 'Bar Chart'),
                                               ('ks_horizontalBar_chart', 'Horizontal Bar Chart'),
                                               ('ks_line_chart', 'Line Chart'),
                                               ('ks_area_chart', 'Area Chart'),
                                               ('ks_pie_chart', 'Pie Chart'),
                                               ('ks_doughnut_chart', 'Doughnut Chart'),
                                               ('ks_polarArea_chart', 'Polar Area Chart'),
                                               ('ks_list_view', 'List View'),
                                               ('ks_kpi', 'KPI'),
                                               ('ks_to_do', 'To Do'),
                                               ('ks_topic', 'Topics')
                                               ], default=lambda self: self._context.get('ks_dashboard_item_type',
                                                                                         'ks_tile'), required=True,
                                              string="Dashboard Item Type",
                                              help="Select the required type of dashboard to display. ")

    ks_topic_data = fields.Text("Topic Data")