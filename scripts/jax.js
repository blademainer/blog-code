const mjpage = require('mathjax-node-page').mjpage
const deasync = require('deasync')

hexo.extend.filter.register(
    'after_render:html',
    str => {
        let data = null
        mjpage(
            str,
            {
                format: ['TeX'],
                singleDollars: true,
                cssInline: false
            },
            { svg: true, css: false, speakText: false },
            x => (data = x)
        )
        deasync.loopWhile(() => data === null)
        return data
    },
    100
)