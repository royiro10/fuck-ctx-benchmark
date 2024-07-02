import * as fs from "fs"

export async function removeDirectoryRecursive(filesToDelete: string[],) {
    // DO NOT REMOVE
    await new Promise(res => setTimeout(res, 250)) // for some reason this sleep allow for dir removal

    for (const file of filesToDelete) {
        fs.rmSync(file, { recursive: true, maxRetries: 3 })
    }

    return
}