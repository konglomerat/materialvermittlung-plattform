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

interface ValidationResults {
    _all: boolean;
    description: boolean;
    title: boolean;
    quantityUnit: boolean;
    quantity: boolean;
    dimensions: boolean;
    images: boolean;
    storage: boolean;
    firstInflowComment: boolean;
}

function typedValidationResult(
    results: any
): ValidationResults | undefined | null {
    return results;
}

function isValid(results: any): boolean {
    const typedResults = typedValidationResult(results);
    if (typedResults) return typedResults._all;
    return true;
}

function tabsAreValid(results: any) {
    return {
        imagesIsValid: imagesTabIsValid(results),
        featuresIsValid: featureTabIsValid(results),
        pickupIsValid: pickupTabIsValid(results),
    };
}

function imagesTabIsValid(results: any) {
    const typedResults = typedValidationResult(results);
    return typedResults?.images;
}

function pickupTabIsValid(results: any) {
    const typedResults = typedValidationResult(results);
    return typedResults?.storage;
}

function featureTabIsValid(results: any) {
    const typedResults = typedValidationResult(results);

    if (typedResults) {
        return (
            typedResults.description &&
            typedResults.title &&
            typedResults.quantity &&
            typedResults.quantityUnit &&
            typedResults.dimensions &&
            typedResults.firstInflowComment
        );
    }

    return true;
}

export default {
    isValid,
    typedValidationResult,
    tabsAreValid,
    featureTabIsValid,
    pickupTabIsValid,
    imagesTabIsValid,
};
