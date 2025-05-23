import DEFAULT_EXTENSIONS from "@Variable/Extension";

import type ProgramOptions from "../Interface/ProgramOptions.tsx";

export type ResolveTsPathOptions = Omit<
	Partial<ProgramOptions>,
	"verbose" | "noEmit"
>;

/**
 * Convert Typescript path aliases to proper relative paths
 * in your transpiled JavaScript code.
 *
 */
export default async (Option: ResolveTsPathOptions = {}): Promise<void> => {
	const {
		Project = "tsconfig.json",
		Source = "Source",
		Extension = DEFAULT_EXTENSIONS,
		Target,
	} = Option;

	const Config = (await import("@Function/Load.js")).default(Project);

	const Path = await (await import("@Function/Resolve/Path.js")).default(
		{ Project, Source, Target },
		Config,
	);

	const changes = (await import("@Function/Generate.js")).default(
		await (await import("@Function/Get.js")).default(
			Path.Target,
			Extension,
		),
		await (await import("@Function/Compute.js")).default(
			Path.Base,
			Config?.options?.paths ?? {},
		),
		Path,
	);

	(await import("@Function/Apply.js")).default(changes);
};
