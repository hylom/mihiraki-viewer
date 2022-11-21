export default {
  build: {
    target: "es2015",
    lib: {
      entry: "lib/index.js",
      format: ["umd", "es"],
      name: "mihiraki",
    }
  },
}
