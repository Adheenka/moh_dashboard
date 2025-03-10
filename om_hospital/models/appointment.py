from odoo import api,fields, models, _
from odoo.exceptions import ValidationError
import random

class HospitalAppointment(models.Model):
    _name = "hospital.appointment"
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _description = "Hospital Appointment"
    _rec_name = 'name'
    _order = 'id desc'



    # name = fields.Char(string="Sequence", required=True, copy=False,
    #                    readonly=True,
    #                    index=True, default=lambda self: _('New'))
    name = fields.Char(string="Sequence", required=True, copy=False, readonly=True,
                           index=True, default=lambda self: _('New'))
    pateint_id = fields.Many2one('hospital.pateint',ondelete='cascade')
    ref = fields.Char(string='Reference', tracking=True)
    gender = fields.Selection(related='pateint_id.gender',readonly=False)

    appointment_time = fields.Datetime(string='Appointment Time', default=fields.Datetime.now)
    booking_time = fields.Date(string='Booking Date',tracking=True, default=fields.Date.context_today)
    prescription = fields.Html(string="Prescription")
    doctor_id = fields.Many2one('res.users', string='Docter',tracking=True)
    operation = fields.Many2one('hospital.operation', string="Operation")
    progress = fields.Integer(string="Progress", compute='_compute_progress')
    # sequence = fields.Char(string="Sequence", readonly=True, copy=False)

    priority = fields.Selection([
        ('0', 'Normal'),
        ('1', 'Low'),
        ('2', 'High'),
        ('3', 'Very High')], string="Priority")
    state = fields.Selection([
        ('draft', 'Draft'),
        ('in_consultation', 'In Consultation'),
        ('done', 'Done'),
        ('cancel', 'Cancelled')],default='draft',required=True, string="status", tracking=1)
    pharmacy_line_ids = fields.One2many('appointment.pharmacy.lines', 'appointment_id', string='Pharmacy Lines')
    hide_sales_price =fields.Boolean(striing="HIde Sales Price")
    duration = fields.Float(string="Duration", tracking=4)

#add monetry fieds
    company_id = fields.Many2one('res.company', string="Company", default=lambda self: self.env.company)
    currency_id = fields.Many2one('res.currency', related='company_id.currency_id')
    full_total = fields.Float(string="Total", compute='_compute_full_total')

    @api.depends('pharmacy_line_ids')
    def _compute_full_total(self):
        for rec in self:
            rec.full_total = sum(rec.pharmacy_line_ids.mapped('subtotal'))

    @api.depends('state')
    def _compute_progress(self):
        for rec in self:
            if rec.state == 'draft':
                progress = random.randrange(10, 25)
            elif rec.state == 'in_consultation':
                progress = random.randrange(26, 99)
            elif rec.state == 'done':
                progress = 100
            else:
                progress = 0
            rec.progress = progress
    # @api.depends('state')
    # def _compute_progress(self):
    #     for rec in self:
    #         if rec.state == 'draft':
    #             progress = 25
    #         elif rec.state == 'in_consultation':
    #             progress = 50
    #         elif rec.state == 'done':
    #             progress = 100
    #         else:
    #             progress = 0
    #         rec.progress = progress
    @api.model
    def create(self, vals):
        if vals.get('name', _('New')) == _('New'):
            vals['name'] = self.env['ir.sequence'].next_by_code(
                'hospital.appointment') or _('New')
            result = super(HospitalAppointment, self).create(vals)
            return result
    # @api.model
    # def create(self, vals):
    #    if vals.get('name', 'New') == 'New':
    #        vals['name'] = self.env['ir.sequence'].next_by_code(
    #            'hospital.pateint.sequence') or 'New'
    #    result = super(HospitalAppointment, self).create(vals)
    #    return result
    # @api.model
    # def create(self, vals):
    #     vals['name'] = self.env['ir.sequence'].next_by_code('hospital.appointment')
    #     return super(HospitalAppointment, self).create(vals)



    # @api.model
    # def create(self, vals):
    #     if vals.get('name', 'New') == 'New':
    #         vals['name'] = self.env['ir.sequence'].next_by_code('hospital.appointment') or 'New'
    #     return super(HospitalAppointment, self).create(vals)

    def action_notification(self):
        action = self.env.ref('om_hospital.action_hospital_pateint')
        return{
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                'title':('Click open patient records'),
                'message': '%s',
                'links': [{
                    'label':self.pateint_id.name,
                    'url': f'#action={action.id}&id={self.pateint_id.id}&model=hospital.pateint'
                }],
                'sticky': True,

            }
        }
    @api.onchange('pateint_id')
    def onchange_pateint_id(self):
        self.ref = self.pateint_id.ref

    def unlink(self):
        for rec in self:
            if rec.state != 'draft':
                raise ValidationError(_("You can delete appointment only in 'Draft' state"))
            return super(HospitalAppointment, self).unlink()
    def action_test(self):
        print("button")
        return {
            'type': 'ir.actions.act_url',
            'target': 'self',
            'url': 'https://github.com/Adheenka/odoo_cybrus/tree/detached2/custom_addons/class_room'
        }

    def action_whatsapp_message(self):
        if not self.pateint_id.phone:
            raise ValidationError('Phone number is not specified')
        message = 'Hai %s Your *Appointment* number is %s' % (self.pateint_id.name, self.name)
        whatsapp_api_url = 'https://api.whatsapp.com/send?phone=%s&text=%s ' % (self.pateint_id.phone, message)
        return {
            'type': 'ir.actions.act_url',
            'target': 'self',
            'url': whatsapp_api_url
        }
    def action_in_consultation(self):
        for rec in self:
            if rec.state == 'draft':
                rec.state = 'in_consultation'
    def action_done(self):
        for rec in self:
            rec.state = 'done'
            return {
                'effect': {
                    'fadout': 'slow',
                    'messege': 'appointment is done',
                    'type': 'rainbow_man'
                }
            }

    def action_cancel(self):
        action = self.env.ref('om_hospital.action_cancel_appointment').read()[0]
        return action
    def action_draft(self):
        for rec in self:
            rec.state = 'draft'
class AppointmentPharmacyLines(models.Model):
    _name = "appointment.pharmacy.lines"

    _description = "Appointment Pharmacy Lines"

    product_id = fields.Many2one('product.product', required=True)
    price_unit = fields.Float(related='product_id.lst_price', digits='Product Price')
    qty = fields.Integer(string='Quantity', default=1)
    appointment_id = fields.Many2one('hospital.appointment',string='Appointment')
    currency_id = fields.Many2one('res.currency', related='appointment_id.currency_id')
    subtotal = fields.Monetary(string="Subtotal", compute="_compute_subtotal", currency_field='currency_id')

    @api.depends('qty', 'price_unit')
    def _compute_subtotal(self):
        for rec in self:
            rec.subtotal = rec.price_unit * rec.qty