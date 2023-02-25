import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    externals: ["discord.js"],
    failOnWarn: false,
    rollup: {
        esbuild: {
            minify: true,
        },
    },
});
