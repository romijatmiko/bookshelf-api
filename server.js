const Hapi = require("@hapi/hapi");
const { v4: uuidv4 } = require("uuid");

const init = async () => {
	const server = Hapi.server({
		port: 9000,
		host: "localhost",
	});

	server.route(require("./routes"));

	await server.start();
	console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

init();
