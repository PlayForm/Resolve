#!/usr/bin/env node
import type Interface from "../Interface/ProgramOptions.js";

export const _Function = async () => {
	const Option = (await (await import("@Function/Create.js")).default())
		.parse()
		.opts<Interface>();

	const Logger = new (await import("@Class/Logger.js")).default(
		Option.Verbose ? "verbose" : "info",
	);

	Logger.Verbose();

	Logger.Param("options", Option);

	try {
		const Configuration = await (await import("@Function/Load.js")).default(
			Option.Project,
		);

		const { rootDir, outDir, baseUrl, paths } = Configuration.options ?? {};

		Logger.Param("compilerOptions", {
			rootDir,
			outDir,
			baseUrl,
			paths,
		});

		const Path = await (await import("@Function/Resolve/Path.js")).default(
			Option,
			Configuration,
		);

		Logger.Param("Path", Path);

		const Alias = await (await import("@Function/Compute.js")).default(
			Path.Base,
			Configuration?.options?.paths ?? {},
		);

		Logger.Param("Alias", Alias);

		const File = await (await import("@Function/Get.js")).default(
			Path.Target,
			Option.Extension,
		);

		Logger.Param("filesToProcess", File);

		const Change = (await import("@Function/Generate.js")).default(
			File,
			Alias,
			Path,
		);

		Logger.Param(
			"fileChanges",
			Change.map(({ File, Change }) => ({ file: File, changes: Change })),
		);

		if (Option.NoEmit) {
			Logger.Info(
				bold("Resolve:"),
				"discovered",
				Change.length,
				"file(s) for change (none actually changed since --noEmit was given)",
			);
		} else {
			(await import("@Function/Apply.js")).default(Change);

			Logger.Info(bold("Resolve:"), "changed", Change.length, "file(s)");
		}
	} catch (_Error) {
		if (_Error instanceof (await import("@Class/Error/Step.js")).default) {
			Logger.Error(
				`Error during step '${bold(_Error.Step)}'`,
				_Error.message,
			);
		} else {
			throw _Error;
		}
	}
};

await _Function();

export const { bold } = await import("ansi-colors");
