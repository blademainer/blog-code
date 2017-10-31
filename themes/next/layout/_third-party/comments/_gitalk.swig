{% if theme.gitalk.enable %}
  <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
  <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
  <script>
    function showGitalk(){
        $("#gitalk_title").attr("style","display:none");
        $("#gitalk_container").attr("style","").addClass("gitalk_container");

        var gitalk = new Gitalk({
            id: window.location.pathname,
            clientID: '{{ theme.gitalk.client_id }}',
            clientSecret: '{{ theme.gitalk.client_secret }}',
            repo: '{{ theme.gitalk.repo }}',
            owner: '{{ theme.gitalk.owner }}',
            admin: ['{{ theme.gitalk.admin }}'],
            distractionFreeMode: true,
            body: location.href
        });

        gitalk.render('gitalk_container');
    }

    {% if !theme.gitalk.click_show %}
      showGitalk();
    {% endif %}

  </script>
{% endif %}