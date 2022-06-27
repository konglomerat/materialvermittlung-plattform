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

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BlogFeedProxyController {
    /**
     * @Route("/api/blog_feed")
     */
    public function index()
    {
        // As we have no influence on the CORS settings of the server hosting the blog we cannot directly
        // load the feed in the frontend, because the request would fail with a CORS error. This is why we
        // add a simple proxy implementation here to make this work for the frontend.

        // TODO: maybe introduce some caching later, to not always load the feed.
        $response = new Response();
        $rss = file_get_contents("https://materialvermittlung.org/?feed=rss2&cat=27");
        $response->setContent($rss);

        return $response;
    }
}
