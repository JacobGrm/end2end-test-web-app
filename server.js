// TODO: Simple http server to serve bower_components and www dir
var express = require('express'),
	serveStatic = require('serve-static'),
	log4js = require('log4js'),
	path = require('path'),
	fs = require('fs'),
	livereload = require('livereload'),
	pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname + path.sep + 'package.json'))),
	configFile = path.resolve(__dirname + path.sep + 'config.json'),
	config = pkg.config,
	PORT = process.env.PORT || config.port,
	app = express(),
  server = livereload.createServer({port: config.livereload}),
	program = {};


program = {
	app: app,
	log: log4js.getLogger(pkg.name),
	config: {
		path: configFile,
		defaults: config,
		get: function(name) {
			return this.defaults[name];
		}
	}
};

app.use(require('json-proxy').initialize(config));

program.config.get('dirs').forEach(function(dir) {
	app.use(express.static(path.resolve(__dirname, dir), {
		index: ['index.html']
	}));
  server.watch(path.resolve(__dirname, dir));
});

program.config.get('routes').forEach(function(route) {
	require(path.resolve(__dirname, route))(program, app);
});

app.listen(PORT, function() {
	program.log.debug('Open your browser to http://localhost:' + PORT);
});
