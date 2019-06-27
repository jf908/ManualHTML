const Vue = require('vue');
const createRenderer = require('vue-server-renderer').createRenderer

module.exports = {
  generator(args, htmlTemplate, vueTemplate, jsonString) {
    const app = new Vue({
      data: {
        man: JSON.parse(jsonString),
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

