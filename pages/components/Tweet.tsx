import { Box } from "@chakra-ui/layout";
import React from "react";
import { TweetObject, UserInfoObject } from "..";

interface Props {
  tweet: TweetObject;
  userInfo: UserInfoObject;
}

const Tweet = ({ tweet, userInfo }: Props) => {
  return (
    <Box
      maxW="100%"
      w="96"
      h="40"
      border="1px solid black"
      borderRadius="lg"
      m="5"
      p="3"
      boxSizing="border-box"
    ></Box>
  );
};

export default Tweet;
