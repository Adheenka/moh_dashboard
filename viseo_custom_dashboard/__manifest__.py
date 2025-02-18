# -*- coding: utf-8 -*-
{
    'name': "viseo_custom_dashboard",

    'summary': """
        Short (1 phrase/line) summary of the module's purpose, 
        used as subtitle on modules listing or apps.openerp.com""",

    'description': """
        Long description of module's purpose
    """,

    'author': "My Company",
    'website': "http://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/13.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base','ks_dashboard_ninja'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/ks_dashboard_ninja_views.xml',
        'views/ks_dashboard_ninja_board.xml',
        'views/templates.xml',
    ],
    'qweb': [
        'static/src/xml/header_template.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'viseo_custom_dashboard/static/src/js/ks_dashboard_ninja.js',
            'viseo_custom_dashboard/static/src/js/ks_dashboard_ninja_graph_preview.js',
            'viseo_custom_dashboard/static/src/js/ks_goal_function.js'
        ],
        'web.assets_qweb': [
            'viseo_custom_dashboard/static/src/xml/**/*'
        ]
    },

    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
}