browserify -r react -r react-dom -r react-addons-update -r react-addons-pure-render-mixin> react-bundle.js
uglifyjs react-bundle.js > react-bundle.min.js