<?php
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

namespace App\Filter;


/**
 * Class SearchHelper
 */
class SearchHelper
{
    /**
     * @param $queryBuilder
     * @param $materialAlias
     * @param $organizationAlias
     * @param $value
     * @return mixed
     */
    public static function buildWhereForAllQueryWords($queryBuilder, $materialAlias, $organizationAlias, $value) {
        // 1. We split the search term in single words
        $searchTermWords = explode(" ", $value);

        // 2. Create WHERE clause for all words joined with OR
        $allWordsJoinedWithOr = $queryBuilder->expr()->orX();
        foreach ($searchTermWords as $word) {
            $wheresForOneWord = SearchHelper::buildWhereOnAllRelevantFields($queryBuilder, $materialAlias, $organizationAlias, $word);
            $allWordsJoinedWithOr->add($wheresForOneWord);
        }
        $wheresForWholeSearchTerm = SearchHelper::buildWhereOnAllRelevantFields($queryBuilder, $materialAlias, $organizationAlias, $value);
        $allWordsJoinedWithOr->add($wheresForWholeSearchTerm);

        // 3. Add to queryBuilder
        return $queryBuilder->andWhere($allWordsJoinedWithOr);
    }

    /**
     * @param $queryBuilder
     * @param $materialAlias
     * @param $organizationAlias
     * @param $value
     * @return mixed
     */
    private static function buildWhereOnAllRelevantFields($queryBuilder, $materialAlias, $organizationAlias, $value) {
        return $queryBuilder->expr()->orX(
            /**
             * Fields that are included in the search. Add more here if needed.
             * We use this for materials and outflows. This works for both because the joined result will have
             * the needed aliases.
             * {@see MaterialSearchFilter::filterProperty()}
             * {@see OutflowSearchFilter::filterProperty()}
             */
            SearchHelper::buildCaseInsensitiveLike($queryBuilder, $materialAlias.".title", $value),
            SearchHelper::buildCaseInsensitiveLike($queryBuilder, $materialAlias.".description", $value),
            SearchHelper::buildCaseInsensitiveLike($queryBuilder, $materialAlias.".color", $value),
            SearchHelper::buildCaseInsensitiveLike($queryBuilder, $organizationAlias.".name", $value)
        );
    }

    /**
     * @param $queryBuilder
     * @param $identifier
     * @param $comparedTo
     * @return mixed
     */
    private static function buildCaseInsensitiveLike($queryBuilder, $identifier, $comparedTo) {
        $caseInsensitiveLike = $queryBuilder->expr()->like("LOWER(" . $identifier . ")", $queryBuilder->expr()->lower($queryBuilder->expr()->literal("%" . $comparedTo . "%")));
        return $caseInsensitiveLike;
    }
}
