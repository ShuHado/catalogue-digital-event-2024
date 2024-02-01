export default {
	root: "src/",
	publicDir: "../static/",
	base: "/catalogue/",
	server: {
		host: true,
		open: true, // Open if it's not a CodeSandbox
	},
	build: {
		outDir: "../dist",
		emptyOutDir: true,
		sourcemap: true,
	},
};
