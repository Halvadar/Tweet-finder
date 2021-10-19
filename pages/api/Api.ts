// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  tweets: any[];
  userInfo: {};
  metaInfo: {};
};
type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const { handle } = req.query;
  let userId;
  if (typeof handle === "object") {
    return res
      .status(400)
      .send({ message: "Only single query parameter needs to be sent!" });
  }
  const user: any = await axios(
    `https://api.twitter.com/2/users/by/username/${handle}`,
    { headers: { Authorization: "Bearer " + process.env.TWITTER_BEARER_TOKEN } }
  );
  if (user.data.errors) {
    return res.status(404).send({ message: "User doesn't exist" });
  }
  userId = user.data.data.id;
  let tweets: any = [];
  let userInfo;
  let metaInfo;

  let nextToken = true;
  let i = 0;
  while (nextToken && i < 2) {
    i++;
    const tweetsResult: any = await fetchTweets(userId);
    if (tweetsResult.data.errors) {
      return res.status(404).send({ message: "User doesn't exist" });
    }
    const { data, includes, meta } = tweetsResult.data;
    userInfo = includes;
    metaInfo = meta;
    tweets = [...tweets, ...data];
    nextToken = tweetsResult.data.meta.next_token;
  }
  const bestTweets = bestTweetPicker(tweets);
  res.status(200).send({ tweets: bestTweets, userInfo, metaInfo });
}

const fetchTweets = async (userId: string, nextToken?: string) => {
  return await axios(`https://api.twitter.com/2/users/${userId}/tweets`, {
    headers: { Authorization: "Bearer " + process.env.TWITTER_BEARER_TOKEN },
    params: {
      max_results: 100,
      expansions: "author_id,referenced_tweets.id,entities.mentions.username",
      "user.fields": "location,name,profile_image_url,url",
      "tweet.fields": "public_metrics",
      pagination_token: nextToken,
    },
  }).catch((err) => {
    console.log(err);
  });
};

const bestTweetPicker = (tweets: any[]) => {
  const sortedTweets = tweets.sort(
    (tweet1, tweet2) =>
      tweet2.public_metrics.likes - tweet1.public_metrics.likes
  );
  return sortedTweets.slice(0, 30);
};
