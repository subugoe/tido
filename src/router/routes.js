const routes = [
  {
    path: '/',
    name: 'EmoViewer',
    component: () => import('src/EmoViewer.vue'),
  },
];
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
  });
}

export default routes;
