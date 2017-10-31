{% if theme.gitment.enable %}
  <link rel="stylesheet" href="https://imsun.github.io/gitment/style/default.css">
  <script src="https://imsun.github.io/gitment/dist/gitment.browser.js"></script>
  <script>
    const myTheme = {
      render(state, instance) {
        const container = document.createElement('div');
        container.lang = "en-US";
        container.className = 'gitment-container gitment-root-container';
        container.appendChild(instance.renderHeader(state, instance));
        container.appendChild(instance.renderEditor(state, instance));
        container.appendChild(instance.renderComments(state, instance));
        container.appendChild(instance.renderFooter(state, instance));
        return container;
      }
    }

    function showGitment(){
      $("#gitment_title").attr("style","display:none");
      $("#gitment_container").attr("style","").addClass("gitment_container");
      var gitment = new Gitment({
        id: window.location.pathname,
        theme: myTheme,
        owner: '{{ theme.gitment.owner }}',
        repo: '{{ theme.gitment.repo }}',
        oauth: {
          client_id: '{{ theme.gitment.client_id }}',
          client_secret: '{{ theme.gitment.client_secret }}'
        }
      });
      gitment.render('gitment_container');
    }

    {% if !theme.gitment.click_show %}
      showGitment();
    {% endif %}
  </script>
{% endif %}