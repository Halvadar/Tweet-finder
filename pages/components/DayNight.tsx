import { Button, useColorMode } from "@chakra-ui/react";
import React from "react";
import { Image } from "@chakra-ui/image";
interface Props {}

const DayNight = (props: Props) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      borderRadius="full"
      position="absolute"
      right="0"
      bg="gray.100"
      m="5"
      _focus={{ outline: 0 }}
      onClick={toggleColorMode}
    >
      <Image
        width="5"
        alt="Day/Night"
        src={colorMode === "light" ? "/Moon.svg" : "/Sun.svg"}
      ></Image>
    </Button>
  );
};

export default DayNight;
