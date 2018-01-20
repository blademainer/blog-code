<div class="copyright">{#
#}{% set current = date(Date.now(), "YYYY") %}{#
#}&copy; {% if theme.footer.since and theme.footer.since != current %}{{ theme.footer.since }} &mdash; {% endif %}{#
#}<span itemprop="copyrightYear">{{ current }}</span>
  <span class="with-love" id="heart">
    <i class="fa fa-{{ theme.footer.icon }}"></i>
  </span>
  <span class="author" itemprop="copyrightHolder">{{ theme.footer.copyright || config.author }}</span>
  
  <span class="post-meta-divider">|</span>
  <span>Hosted by <a href="https://pages.coding.me" id="coding">Coding Pages</a></span>
  <script type="text/javascript" src="http://vincentqyw.github.io/js/src/tw_cn.js"></script>
	<script type="text/javascript">
	  var defaultEncoding = 2; //网站编写字体是否繁体，1-繁体，2-简体
	  var translateDelay = 0; //延迟时间,若不在前, 要设定延迟翻译时间, 如100表示100ms,默认为0
	  var cookieDomain = "http://vincentqyw.github.io/"; //Cookie地址, 一定要设定, 通常为你的网址
	  var msgToTraditionalChinese = "繁体"; //此处可以更改为你想要显示的文字
	  var msgToSimplifiedChinese = "简体"; //同上，但两处均不建议更改
	  var translateButtonId = "translateLink"; //默认互换id
	  translateInitilization();
  </script>
  <span class="post-meta-divider">|</span>
  <a id="translateLink" href="javascript:translatePage();">繁体</a>

	
  {% if theme.post_wordcount.totalcount %}
    <span class="post-meta-divider">|</span>
    <span class="post-meta-item-icon">
      <i class="fa fa-area-chart"></i>
    </span>
    {% if theme.post_wordcount.item_text %}
      <span class="post-meta-item-text">{{ __('post.totalcount') }}&#58;</span>
    {% endif %}
    <span title="{{ __('post.totalcount') }}">{#
    #}{{ totalcount(site, '0,0.0a') }}{#
  #}</span>
  {% endif %}
</div>

{% if theme.footer.powered %}
  <div class="powered-by">{#
  #}{{ __('footer.powered', '<a class="theme-link" target="_blank" href="https://hexo.io">Hexo</a>') }}{#
#}</div>
{% endif %}

{% if theme.footer.powered and theme.footer.theme.enable %}
  <span class="post-meta-divider">|</span>
{% endif %}

{% if theme.footer.theme.enable %}
  <div class="theme-info">{#
  #}{{ __('footer.theme') }} &mdash; {#
  #}<a class="theme-link" target="_blank" href="https://github.com/iissnan/hexo-theme-next">{#
    #}NexT.{{ theme.scheme }}{#
  #}</a>{% if theme.footer.theme.version %} v{{ theme.version }}{% endif %}{#
#}</div>
{% endif %}

{% if theme.footer.custom_text %}
  <div class="footer-custom">{#
  #}{{ theme.footer.custom_text }}{#
#}</div>
{% endif %}
