/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import process from 'node:process'
import test from 'node:test'
import {remark} from 'remark'
import remarkUnlinkProtocols from 'remark-unlink-protocols'

test('remarkUnlinkProtocols', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('remark-unlink-protocols')).sort(),
      ['default']
    )
  })
})

test('fixtures', async function (t) {
  const base = new URL('fixtures/', import.meta.url)
  const folders = await fs.readdir(base)

  let index = -1

  while (++index < folders.length) {
    const folder = folders[index]

    if (folder.startsWith('.')) continue

    await t.test(folder, async function () {
      const folderUrl = new URL(folder + '/', base)
      const inputUrl = new URL('input.md', folderUrl)
      const outputUrl = new URL('output.md', folderUrl)

      const input = String(await fs.readFile(inputUrl))
      /** @type {{ except: string[] } | undefined} */
      const options = await readOptions(new URL('options.json', folderUrl))

      /** @type {string} */
      let output

      const process_ = remark().use(remarkUnlinkProtocols, options)

      const actual = String(await process_.process(input))

      try {
        if ('UPDATE' in process.env) {
          throw new Error('Updating…')
        }

        output = String(await fs.readFile(outputUrl))
      } catch {
        output = actual
        await fs.writeFile(outputUrl, actual)
      }

      assert.equal(actual, String(output))
    })
  }
})

/**
 * @param {import("fs").PathLike | fs.FileHandle} optionsUrl
 * @returns {Promise<{except: string[]} | undefined>}
 */
async function readOptions(optionsUrl) {
  /** @type { Buffer } */
  let data
  try {
    data = await fs.readFile(optionsUrl)
  } catch {
    return undefined
  }
  return JSON.parse(String(data))
}
