const e=async o=>{const i=(await import("typescript")).findConfigFile(process.cwd(),t.fileExists,o);if(!i)throw new(await import("../Class/Error/FileNotFound.js")).default(e.name,o);return(await import("typescript")).parseJsonConfigFileContent((await import("typescript")).readConfigFile(i,t.readFile).config,t,(await import("path")).dirname(i))};var n=e;const{sys:t}=await import("typescript");export{e as _Function,n as default,t as sys};
