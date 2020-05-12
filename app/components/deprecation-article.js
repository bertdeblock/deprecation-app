import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  prism: service(),
  renderIdOrUntil: true,
  idForTitle: computed('model.title', function() {
    return `toc_${this.get('model.title')}`;
  }),
  idForUntil: computed('model.until', function() {
    return `toc_until-${this.get('model.until')}`;
  }),

  didRender() {
    let nodeList = document.querySelectorAll('pre:not(.no-line-numbers) > code');

    if (nodeList) {
      nodeList.forEach((code) => {
        code.parentNode.classList.add("line-numbers")
      });
    }

    let filenameNodeList = document.querySelectorAll('pre > code');

    if (filenameNodeList) {
      filenameNodeList.forEach((code) => {
        code.tabIndex = 0;
        let filename = code.attributes['data-filename'] ? code.attributes['data-filename'].value : null;
        let match;

        if (filename) {
          match = filename.match(/\.(\w+)$/);
        }

        let ext = '';

        if (match && match[1]) {
          ext = match[1];
        } else {
          // pull file type from language
          if(code.classList.contains('handlebars')) {
            ext = 'hbs';
          } else if (code.classList.contains('javascript')) {
            ext = 'js';
          }
        }

        let wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('filename');
        if (ext) {
          wrapperDiv.classList.add(ext);
        }
        wrapperDiv.style.position = 'relative';

        // code.parentNode.classList.add(ext);
        code.parentNode.parentNode.appendChild(wrapperDiv);
        wrapperDiv.appendChild(code.parentNode);

        // this.$(code.parentNode).wrap(`<div class="filename ${ext}" style="position: relative;"></div>`);

        if (filename) {
          let span = document.createElement('span');
          span.innerHTML = filename;
          code.parentNode.parentNode.prepend(span);
        }
        let ribbonDiv = document.createElement('div');
        ribbonDiv.classList.add('ribbon');
        code.parentNode.parentNode.prepend(ribbonDiv);
      });
    }

    this.$(".anchorable-toc").each(function () {
      let currentToc = $(this);

      currentToc.wrap(`<a class="bg-none toc-anchor" href="#${currentToc.attr('id')}"></a>`)
    })

    this.prism.highlight();
  }
});
