sed -i 's/localhost:8081/passagemaster.com/g' client/index.html ./server.js
./node_modules/.bin/minify . ./client/css ./client/js --template {{filename}}.{{ext}}
