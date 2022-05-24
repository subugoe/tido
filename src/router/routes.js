import MainView from 'src/views/MainView';

const routes = [
  {
    path: '/',
    name: 'MainView',
    component: MainView,
  },
];
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  // Always leave this as last one,
  // but you can also remove it
  routes.push({
    path: '/:catchAll(.*)*',
  });
}

export default routes;
