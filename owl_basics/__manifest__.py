{
    'name': 'learing owl',
    'version': '1.0',
    'category': 'Purchases',
    'summary': 'Manage owl',
    'sequence': -93,
    'description': """
        This module adds an approval workflow for purchase orders odoo.
    """,
    'author': 'abrus',
    'website': 'https://www.example.com',
    'depends': ['base', 'stock', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'view/menu.xml',
        'view/owl.xml',


    ],
    'assets': {
        'web.assets_qweb': ['owl_basics/static/src/xml/*',
                            ],
        'web.assets_backend': ['owl_basics/static/src/js/owl_study.js',
                               ],
    },
    'demo': [],
    'installable': True,
    'application': True,
    'auto_install': False,
}