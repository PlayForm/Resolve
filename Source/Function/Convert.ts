import type Alias from "../Interface/Alias.tsx";
import type ProgramPaths from "../Interface/ProgramPaths.tsx";

/**
 * Convert an aliased path to a relative path.
 *
 * @param importSpecifier A import specifier as used in the source file
 * @param outputFile The location of the file that the aliased path was from.
 * @param aliases The path mapping configuration from tsconfig.
 * @param programPaths Program options.
 * @param esModule Whether the import will be resolved with ES module semantics or commonjs semantics
 *
 */
export default async (
	Specifier: string,
	File: string,
	Alias: Alias[],
	{ Source, Target }: Pick<ProgramPaths, "Source" | "Target">,
	Module?: boolean,
): Promise<{ Original: string; Replace?: string }> => {
	const Directory = dirname(resolve(Source, relative(Target, File)));

	const Absolute = await (Specifier.startsWith("./") ||
	Specifier.startsWith("../")
		? [resolve(Directory, Specifier)]
		: Alias.filter(({ Prefix }) => Specifier.startsWith(Prefix)).flatMap(
				({ Prefix, Path }) =>
					Path.map((aliasPath) =>
						resolve(aliasPath, Specifier.replace(Prefix, "")),
					),
			)
	).reduce<null | ReturnType<typeof Import>>(
		async (acc, path) => acc || (await Import(path)),
		null,
	);

	if (!Absolute) {
		return {
			File: File,
			Original: Specifier,
		};
	}

	const ImportAbsolute = Module ? Absolute.File : Absolute.Import;

	const Relative =
		Absolute.Type === "file"
			? (await import("node:path")).join(
					relative(Directory, dirname(ImportAbsolute)),
					(await import("node:path")).basename(ImportAbsolute),
				)
			: relative(Directory, ImportAbsolute)
					.replace(/^(?!\.+\/)/, (m) => `./${m}`)
					.replace(/\.[^/.]*ts[^/.]*$/, (match) =>
						match
							.replace(/\.ts$/, ".js")
							.replace(/\.tsx$/, ".jsx")
							.replace(/\.mts$/, ".mjs")
							.replace(/\.cts$/, ".cjs"),
					);

	const Extension = (await import("@Function/File.js")).default(
		resolve(dirname(File), Relative),
	)
		? Relative
		: Relative.replace(/\.jsx$/, ".js");

	return {
		Original: Normalize(Specifier),
		...(Specifier !== Extension && {
			Replace: Normalize(Extension),
		}),
	};
};

export const { default: Normalize } = await import("@Function/Normalize");

export const { default: Import } = await import("@Function/Resolve/Import");

export const { resolve, relative, dirname } = await import("node:path");
