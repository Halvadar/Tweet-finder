import { Link } from "@chakra-ui/layout";
import { ReactElement } from "react";
import { Mention } from "../pages";

export const mentionSplitter = (text: string, mentions: Array<Mention>) => {
  let newTextArr: Array<string | ReactElement> = [];

  mentions.forEach((mention, index) => {
    //First mention
    if (index === 0) {
      newTextArr.push(text.slice(0, mention.start));
    }
    //Every mention
    const mentionString = text.slice(mention.start, mention.end);
    const newLinkElement = (
      <Link
        color="blue.300"
        _hover={{ textDecoration: "none" }}
        _focus={{ outline: 0 }}
        target="_blank"
        href={"https://twitter.com/" + mentionString}
      >
        {mentionString}
      </Link>
    );

    newTextArr.push(newLinkElement);

    //Last Mention
    if (index === mentions.length - 1) {
      newTextArr.push(text.slice(mention.end, text.length));

      //Mid mention
    } else {
      newTextArr.push(text.slice(mention.end, mentions[index + 1].start));
    }
  });
  return newTextArr;
};
