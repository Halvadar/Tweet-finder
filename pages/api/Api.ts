// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  tweets: [];
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
  const tweets: any = await axios(
    `https://api.twitter.com/2/users/${userId}/tweets`,
    {
      headers: { Authorization: "Bearer " + process.env.TWITTER_BEARER_TOKEN },
      params: {
        max_results: 10,
        expansions: "author_id,referenced_tweets.id,entities.mentions.username",
        "user.fields": "location,name,profile_image_url,url",
      },
    }
  );
  if (tweets.data.errors) {
    return res.status(404).send({ message: "User doesn't exist" });
  }
  const { data, includes, meta } = tweets.data;

  res.status(200).send({ tweets: data, userInfo: includes, metaInfo: meta });
}
