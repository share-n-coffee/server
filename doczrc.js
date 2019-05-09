export default {
  title: 'Forge_server',
  description: 'Documentation',
  themeConfig: {
    mode: 'dark',
    colors: {
      primary: '#45E2D1'
    },
    styles: {
      h1: `
        font-size: 80px;
        margin-bottom: 10px;
      `
    }
  },
  modifyBundlerConfig: config => {
    /* do your magic here */
    return config;
  },
  plugins: []
};
