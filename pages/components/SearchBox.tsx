import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Flex, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";

interface Props {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setTweets: Dispatch<SetStateAction<any>>;
  setUserInfo: Dispatch<SetStateAction<any>>;
  setMetaInfo: Dispatch<SetStateAction<any>>;
  showError: Function;
}

const SearchBox = ({
  isLoading,
  setIsLoading,
  setTweets,
  setUserInfo,
  setMetaInfo,
  showError,
}: Props) => {
  const [inputVal, setInputVal] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };
  const onClick = async () => {
    if (inputVal.length === 0) {
      showError("Input is Empty!");
      return;
    }
    setIsLoading(true);
    await axios("/api/Api?handle=" + inputVal)
      .then((res: any) => {
        const { tweets, userInfo, metaInfo } = res.data;
        console.log(res.data);
        setTweets(tweets);
        setUserInfo(userInfo.users[0]);
        setMetaInfo({ next_token: metaInfo.next_token });
      })
      .catch((err) => {
        showError(err.message);
      });

    setIsLoading(false);
  };

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
