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

import React, { FC, useState, useEffect } from "react";
import Parser, { Item } from "rss-parser";
import StoryCard from "../../components/StoryCard";

const regex = /(https:\/\/materialvermittlung\.org\/wp-content\/uploads\/.+?)"/m;

const rssParser = new Parser({
    customFields: {
        item: ["post-id"],
    },
});

// @ts-ignore
const StoriesFeed: FC = () => {
    const [stories, setStories] = useState<Item[]>([]);

    useEffect(() => {
        // IMPORTANT: we use an empty dependency array to only load the feed once!
        rssParser.parseURL("/api/blog_feed", function (err, feed) {
            if (feed) {
                setStories(feed.items || []);
            }
        });
    }, []);

    const renderLoadedStories = () => {
        const storyNodes = stories.map((story) => {
            const imageMatch = story.content?.match(regex);
            const image = imageMatch?.[1] || undefined;
            return (
                <a
                    href={story.link}
                    key={story["post-id"]}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <StoryCard
                        title={story.title}
                        /*
                         * contentSnippet contains plainText; content includes markup
                         * we could parse and remove the markup ourselves
                         * thus we would now exactly where the "Weiterlesen" comes from
                         * <p class="read-more"><a class="btn btn-default" href="https://materialvermittlung.org/?p=958">Weiterlesen<span class="screen-reader-text"> Weiterlesen</span></a></p>
                         * or we just remove it manually from contentSnippet
                         * and avoid any problems with removing all the markup (like images) manually
                         */
                        content={story.contentSnippet?.replaceAll(
                            "Weiterlesen Weiterlesen",
                            ""
                        )}
                        date={story.pubDate}
                        author={story.creator}
                        image={image}
                    />
                </a>
            );
        });
        return storyNodes as JSX.Element[];
    };

    const renderStoriesSkeleton = () => (
        <>
            <StoryCard />
            <StoryCard />
            <StoryCard />
        </>
    );

    if (stories.length > 0) {
        return renderLoadedStories();
    } else {
        return renderStoriesSkeleton();
    }
};

export default StoriesFeed;
