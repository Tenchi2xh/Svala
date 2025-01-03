import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { exec } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { promisify } from "node:util"

const execAsync = promisify(exec);

const scalaJsPreprocess = () => {
	return {
		name: 'svelte-scalajs',
		script: async ({ content, attributes }) => {
			if (attributes.lang === 'scala') {
				if (!existsSync('./tmp')) mkdirSync('./tmp');
				const tmpFile = './tmp/Script.scala';
				writeFileSync(tmpFile, content);

				await execAsync('sbt fastOptJS');
				const rawCode = readFileSync('./target/scala-3.3.3/svala-fastopt.js').toString();
				const map = readFileSync('./target/scala-3.3.3/svala-fastopt.js.map').toString();

				// Find every `export { foo as bar };` and rename internal names to exported names
                const exportRegex = /export\s+\{([^}]+)\};/g;
				let codeWithGlobals = rawCode
				rawCode.replace(exportRegex, (_, p1) => {
                    const exports = p1.split(',').map(item => item.trim());

                    exports.forEach(item => {
                        const [originalName, globalName] = item.split(' as ').map(part => part.trim());
						codeWithGlobals = codeWithGlobals.replaceAll(originalName, globalName)
                    });

					return '';
                });

				// generated ScalaJS code:
				// - uses $ as a prefix, which is not allowed by Svelte
				// - uses var everywhere, which fails when re-declaring the same name in another scope
				const code = codeWithGlobals
					.replace(/\$/g, 'scala_')
					.replace(/\bvar\b/g, 'let')

				return {
					code,
					map,
				};
			}
		},
	};
};

const config = {
	kit: {
		adapter: adapter(),
	},
	preprocess: [
		vitePreprocess(),
		scalaJsPreprocess(),
	]
};

export default config;
