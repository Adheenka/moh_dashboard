from odoo import models, fields, api, http


class OwlStudy(models.Model):
    _name = 'owl.study'
    _description = 'Owl basics'

    name = fields.Char(string='Name', required=True)
    date_of_birth = fields.Date(string='Date of Birth')
    country = fields.Char(string='Country')
    date_fetch = fields.Date(string='Date Fetch', default=fields.Date.today)


































