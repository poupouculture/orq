const routes = [
  {
    path: '/',
    component: () => import('pages/MessageUi.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/Languagetranslator',
    component: () => import('pages/IndexPage.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/ApplicationProgram',
    component: () => import('pages/ApplicationProgram.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  }, {
    path: '/Calendar',
    component: () => import('pages/CalendarPage.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  }, {
    path: '/Company',
    component: () => import('pages/CompanyPage.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  }, {
    path: '/Contacts',
    component: () => import('pages/ContactsPage.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/Dashboard',
    component: () => import('pages/Dashboard.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  }, {
    path: '/KnowledgeForm',
    component: () => import('pages/KnowledgeForm.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  }, {
    path: '/PhoneRecord',
    component: () => import('pages/PhoneRecord.vue'),
    children: [
      { path: '', component: () => import('pages/PhoneRecord.vue') }
    ]
  }, {
    path: '/ReportForm',
    component: () => import('pages/ReportForm.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  }, {
    path: '/ServiceRecord',
    component: () => import('src/pages/ServiceRecord.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  }, {
    path: '/WorkOrder',
    component: () => import('pages/WorkOrder.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/Message',
    component: () => import('pages/MessageUi.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Home.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
