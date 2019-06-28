const Vue = require('vue');
const createRenderer = require('vue-server-renderer').createRenderer

module.exports = {
  generator(args, htmlTemplate, vueTemplate, schema) {
    const app = new Vue({
      data: {
        man: schema,
        javascript: !args['--nojs']
      },
      template: vueTemplate
    });

    const renderer = createRenderer({
      template: args['--dark'] ? htmlTemplate.replace('<html', '<html class="theme-dark"') : htmlTemplate
    });

    return renderer.renderToString(app);
  }
}

