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

import imageCompression from "browser-image-compression";

const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1800,
    useWebWorker: true,
};

export default (files: File[]) => {
    const promises = files.map((file) => {
        return imageCompression(file, options).then((compressedFile) => {
            return compressedFile;
        });
    });
    return Promise.all(promises);
};
