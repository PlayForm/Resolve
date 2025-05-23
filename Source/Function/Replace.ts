import type Alias from "../Interface/Alias.tsx";
import type ProgramPaths from "../Interface/ProgramPaths.tsx";
import type TextChange from "../Interface/TextChange.tsx";

/**
 * Read the file at the given path and return the text with aliased paths replaced.
 *
 * @param filePath The path to the file.
 * @param aliases The path mapping configuration from tsconfig.
 * @param programPaths Program options.
 *
 */
export const _Function = async (
	filePath: string,
	Alias: Alias[],
	Path: Pick<ProgramPaths, "Source" | "Target">,
): Promise<{ Changed: boolean; Text: string; Change: TextChange[] }> => {
	try {
		await (await import("node:fs/promises")).access(
			filePath,
			(await import("node:fs/promises")).constants.F_OK,
		);
	} catch (error) {
		throw new (await import("@Class/Error/FileNotFound")).default(
			_Function.name,
			filePath,
		);
	}

	const Text = await (await import("node:fs/promises")).readFile(
		filePath,
		"utf-8",
	);

	const Change: TextChange[] = [];

	const Match = Text.match(
		/((?:require\(|require\.resolve\(|import\()|(?:import|export)\s+(?:[\s\S]*?from\s+)?)['"]([^'"]*)['"]\)?/g,
	);

	const Replace = Match
		? await Promise.all(
				Match.map(async (Match) => {
					const Result = Match.match(
						/((?:require\(|require\.resolve\(|import\()|(?:import|export)\s+(?:[\s\S]*?from\s+)?)['"]([^'"]*)['"]\)?/,
					);

					if (!Result) {
						return Match;
					}

					const [, Statement, Specifier] = Result;

					// The import is an esm import if it is inside a typescript (definition) file or if it uses `import` or `export`
					const { Original, Replace } = await (
						await import("@Function/Convert")
					).default(
						Specifier ?? "",
						filePath,
						Alias,
						Path,
						!filePath.endsWith(".ts") &&
							(Statement?.includes("import") ||
								Statement?.includes("export")),
					);

					if (!Replace) {
						return Text;
					}

					const Index = Text.lastIndexOf(Specifier ?? "");

					Change.push({
						Original: Normalize(Original),
						Modify: Normalize(Replace),
					});

					return (
						Text.substring(0, Index) +
						Replace +
						Text.substring(Index + (Specifier ?? "").length)
					);
				}),
			)
		: Text;

	return {
		Changed: Text !== Replace,
		Text: Replace.toString(),
		Change: Change,
	};
};

export default _Function;

export const { default: Normalize } = await import("@Function/Normalize");
