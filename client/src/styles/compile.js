/*
 * Copyright (c) 2022 Sandstorm Media GmbH
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

const { exec } = require("child_process");
const fs = require("fs");
const chokidar = require("chokidar");
_ = require("lodash");

const isWatchMode = process.argv.slice(2).indexOf("--watch") >= 0;

function createCommand() {
  const overrides = JSON.parse(
    fs.readFileSync("src/styles/antdOverrides.json")
  );
  const modifyVars = Object.entries(overrides).reduce(
    (accumulator, current) => {
      return `${accumulator}--modify-var=${current[0]}="${current[1]}" `;
    },
    ""
  );

  return `npx lessc --js ${modifyVars} src/App.less src/App.css`;
}

function execCommand(path = null) {
  if (path) console.log(path, "changed");
  exec(createCommand(), (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err);
    } else {
      // the *entire* stdout and stderr (buffered)
      console.log(`COMPILE FINISHED`);
    }
  });
}

if (isWatchMode) {
  execCommand();
  console.log("STARTING WATCHMODE");
  const watcher = chokidar.watch(
    ["src/**/*.less", "src/styles/antdOverrides.json"],
    {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      ignoreInitial: true,
      persistent: true,
    }
  );
  watcher.on("change", (path) => {
    _.debounce(function () {
      execCommand(path);
    }, 500)();
  });
} else {
  execCommand();
}
