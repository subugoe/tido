const routes = [
  {
    path: '/',
    name: 'MainView',
    component: () => import('src/views/MainView.vue'),
  },
];
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
  });
}

export default routes;
