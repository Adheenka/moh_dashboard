# -*- coding: utf-8 -*-
{
    'name': "moh_dashboard",

    'summary': """
        Short (1 phrase/line) summary of the module's purpose, used as
        subtitle on modules listing or apps.openerp.com""",

    'description': """
        Long description of module's purpose
    """,

    'author': "My Company",


    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'ks_dashboard_ninja'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/templates.xml',
        'views/inherit_ks_dashboard_ninja_item_view.xml',
    ],
    # only loaded in demonstration mode
    'demo': ['demo/demo.xml' ],
    'assets': {
  	    'web.assets_backend': [
            'moh_dasdboard/static/src/js/topics_dashboard_ninja_templates.js'

        ],
		'web.assets_qweb': [
			'moh_dashboard/static/src/xml/**/*'
		]
	},
    'auto_install': False,
    'application': True,
}
