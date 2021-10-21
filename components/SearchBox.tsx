import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Flex, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import React, {
  Dispatch,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { TweetObject, UserInfoObject } from "../pages";

interface Props {
  tweets: Array<TweetObject>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setTweets: Dispatch<SetStateAction<any>>;
  setUserInfo: Dispatch<SetStateAction<any>>;
  setMetaInfo: Dispatch<SetStateAction<any>>;
  showError: Function;
  tweetsContainer: Ref<HTMLDivElement>;
  userInfo: UserInfoObject;
}

const SearchBox = ({
  tweets,
  isLoading,
  setIsLoading,
  setTweets,
  setUserInfo,
  setMetaInfo,
  showError,
  tweetsContainer,
  userInfo,
}: Props) => {
  const scrollTimeoutRef = useRef<any>();
  const [inputVal, setInputVal] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputVal(e.target.value);
    if (tweets.length !== 0) {
      setTweets([]);
      setUserInfo({});
    }
  };
  const onClick = async () => {
    if (inputVal.length === 0) {
      showError("Input is Empty!");
      return;
    }
    const trimmedInput =
      inputVal[0] === "@" ? inputVal.substring(1, inputVal.length) : inputVal;
    if (trimmedInput.toLowerCase() === userInfo.username?.toLowerCase()) {
      scrollToTweets(tweets.length);
      return;
    }
    setIsLoading(true);

    await axios("/api/Api?handle=" + trimmedInput)
      .then((res: any) => {
        const { tweets, userInfo, metaInfo } = res.data;
        console.log(tweets);
        scrollToTweets(tweets.length);

        setTweets(tweets);
        setUserInfo(userInfo.users[0]);
        setMetaInfo({ next_token: metaInfo.next_token });
      })
      .catch((err) => {
        showError(err.response.data.message);
      });

    setIsLoading(false);
  };
  const scrollToTweets = (tweetsLength: number) => {
    if (tweetsLength > 0) {
      scrollTimeoutRef.current = setTimeout(() => {
        window.scroll({
          left: 0,
          //@ts-ignore
          top: tweetsContainer.current.offsetTop,
          behavior: "smooth",
        });
      }, 200);
    }
  };
  useEffect(() => {
    return () => {
      clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <HStack spacing="3" mt="5">
      <Input
        onKeyPress={(e) => e.key === "Enter" && onClick()}
        value={inputVal}
        onChange={handleChange}
        placeholder="User handle e.g. @Trump"
      ></Input>
      <Button isLoading={isLoading} onClick={onClick} _focus={{ outline: 0 }}>
        Search
      </Button>
    </HStack>
  );
};

export default SearchBox;
