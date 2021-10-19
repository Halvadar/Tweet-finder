import Icon from "@chakra-ui/icon";
import { Image, Img } from "@chakra-ui/image";
import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  Wrap,
} from "@chakra-ui/layout";
import React, { useEffect, useRef, useState } from "react";
import { TweetObject, UserInfoObject } from "..";
import { mentionSplitter } from "../utils/mention";
interface Props {
  tweet: TweetObject;
  userInfo: UserInfoObject;
  index: number;
}

const Tweet = ({ tweet, userInfo, index }: Props) => {
  const { text, entities } = tweet;
  const { id, location, name, profile_image_url, url, username } = userInfo;
  const [transShouldStart, setTransShouldStart] = useState(false);
  const timeOutRef = useRef<any>();
  useEffect(() => {
    timeOutRef.current = setTimeout(() => {
      // @refresh reset
      setTransShouldStart(true);
    }, (index % 10) * 150);
  }, [index]);
  const fixedText =
    entities?.mentions && mentionSplitter(text, entities.mentions);
  return (
    <Flex
      transition="all 0.8s ease-out"
      transform={`translateY(${transShouldStart ? "0" : "-10%"})`}
      opacity={transShouldStart ? "100%" : "0%"}
      maxW="100%"
      w="96"
      border="1px"
      borderColor="gray.300"
      boxShadow="lg"
      borderRadius="lg"
      m="5"
      p="3"
      boxSizing="border-box"
      direction="column"
    >
      <HStack spacing="10px">
        <Link
          _focus={{ outline: 0 }}
          target="_blank"
          href={"https://twitter.com/" + username}
        >
          <Img
            src={profile_image_url}
            borderRadius="full"
            alt="profile image"
          ></Img>
        </Link>
        <Flex direction="column">
          <Heading size="sm"> {name}</Heading>
          <Link
            _focus={{ outline: 0 }}
            target="_blank"
            href={"https://twitter.com/" + username}
            fontSize="medium"
            color="gray.500"
          >
            {`@${username}`}
          </Link>
        </Flex>
      </HStack>
      <Text>{!fixedText ? text : fixedText.map((fragment) => fragment)})</Text>
      {(location || url) && (
        <>
          <Divider my="10px" />
          <Wrap>
            {location && (
              <Flex alignItems="center">
                <Image src={"/Location.svg"} height="4" alt="Location"></Image>
                <Text> {location}</Text>
              </Flex>
            )}
            {url && (
              <Flex alignItems="center">
                <Image src={"/Link.svg"} height="4" alt="Link"></Image>
                <Link color="blue.400" href={url} target="_blank">
                  {url}
                </Link>
              </Flex>
            )}
          </Wrap>
        </>
      )}
    </Flex>
  );
};

export default Tweet;
