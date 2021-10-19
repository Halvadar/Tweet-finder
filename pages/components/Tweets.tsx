import { Box, Flex } from "@chakra-ui/layout";
import React, { ReactElement } from "react";
import { TweetObject, UserInfoObject } from "..";
import Tweet from "./Tweet";

interface Props {
  tweets: Array<TweetObject>;
  userInfo: UserInfoObject;
}

function Tweets({ tweets, userInfo }: Props): ReactElement {
  return (
    <Flex
      my="10"
      mx="5"
      direction="row"
      wrap="wrap"
      justifyContent="center"
      alignItems="flex-start"
    >
      {tweets.map((tweet, index) => {
        const { id } = tweet;
        return (
          <Tweet index={index} key={id} tweet={tweet} userInfo={userInfo} />
        );
      })}
    </Flex>
  );
}

export default Tweets;
