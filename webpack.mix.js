let mix = require('laravel-mix');


mix.js('src/js/app.js', 'assets')
.autoload({
jquery: ['$', 'window.jQuery']
})
.sass('src/scss/app.scss', 'assets')