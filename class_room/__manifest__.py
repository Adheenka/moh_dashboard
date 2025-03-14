# -*- coding: utf-8 -*-
{
    'name': "School Management'",

    'summary': """ this module helping school management
        """,

    'description': """
        class room management system
    """,
    'sequence': -10,
    'author': "My Company",

    'category': 'Classroom',
    'version': '1.0.0',

    # any module necessary for this one to work correctly
    'depends': ['base','board','sale','website','report_xlsx'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'data/sequence_data.xml',
        'security/security.xml',
        'wizard/classroom_report_view.xml',
        'views/views.xml',
        'views/menu.xml',
        'views/dashboard.xml',
        'views/website_form.xml',
        'report/classroom_details.xml',
        'report/report.xml',
        'report/student_card.xml',




    ],
    'assets':{
        'web.assets_common':['class_room/static/src/js/website_form_validation.js'],
    },
    # only loaded in demonstration mode
    'demo': [],

    'auto_install': False,
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
