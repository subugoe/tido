//
// const routes = [
//   {
//     path: '/',
//     component: () => import('layouts/MainLayout.vue'),
//     children: [
//       { path: '', component: () => import('pages/Index.vue') },
//     ],
//   },
// ];
const routes = [
  {
    path: '/',
    name: 'TwinView',
    component: () => import('@/pages/quasar-twinview.vue'),
  },
];
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
