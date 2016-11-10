browserify --bare -r ksana-corpus -r ksana-jsonrom -u react-native -u ksana-react-native-module > ksana-bundle.js
uglifyjs ksana-bundle.js > ksana-bundle.min.js