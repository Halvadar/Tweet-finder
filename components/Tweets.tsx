import { Box, Flex } from "@chakra-ui/layout";
import React, {
  forwardRef,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { TweetObject, UserInfoObject } from "../pages";
import Tweet from "./Tweet";

interface Props {
  tweets: Array<TweetObject>;
  userInfo: UserInfoObject;
}

const Tweets = forwardRef<HTMLDivElement, Props>(
  ({ tweets, userInfo }: Props, ref): ReactElement => {
    const [visibleTweets, setVisibleTweets] = useState<number>(10);

    const onScroll = () => {
      if (
        Math.ceil(document.documentElement.scrollTop) +
          document.documentElement.clientHeight ===
        document.documentElement.scrollHeight
      ) {
        const tweetsLength = tweets.length;
        if (tweetsLength > visibleTweets) {
          if (tweetsLength - visibleTweets >= 10) {
            setVisibleTweets(visibleTweets + 10);
          } else {
            setVisibleTweets(tweetsLength);
          }
        }
      }
    };
    useEffect(() => {
      setVisibleTweets(10);
    }, [userInfo?.username]);
    useEffect(() => {
      window.addEventListener("scroll", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }, [tweets]);
    useEffect(() => {});

    return (
      <Flex
        ref={ref}
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
            index < visibleTweets && (
              <Tweet index={index} key={id} tweet={tweet} userInfo={userInfo} />
            )
          );
        })}
      </Flex>
    );
  }
);

Tweets.displayName = "Tweets";

export default Tweets;
