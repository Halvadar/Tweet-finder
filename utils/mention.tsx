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
  newTextArr.forEach((val, index) => {
    if (typeof val === "string" && val.length !== 0) {
      const firstPart = newTextArr.slice(0, index);
      const lastPart = newTextArr.slice(index + 1);
      newTextArr = [...firstPart, ...hashtagSplitter(val), ...lastPart];
    }
  });
  return newTextArr;
};

const hashtagSplitter = (text: string) => {
  let newTextArr: any[] = [];
  const reg = /\#.*?(?=\s)/dg;
  let matchedResults: { result: any; start: number; end: number }[] = [];
  let result;

  let i = 0;
  while ((result = reg.exec(text)) !== null) {
    matchedResults.push({
      result: result[0],
      start: result.index,
      end: reg.lastIndex,
    });
  }
  matchedResults.forEach((frag, index) => {
    if (index === 0) {
      newTextArr.push(text.slice(0, frag.start));
    } else {
      console.log(frag.result.slice(0, frag.result.length));
      const newLinkElement = (
        <Link
          color="blue.300"
          _hover={{ textDecoration: "none" }}
          _focus={{ outline: 0 }}
          target="_blank"
          href={
            "https://twitter.com/hashtag/" +
            frag.result.slice(1, frag.result.length)
          }
        >
          {frag.result}
        </Link>
      );
      newTextArr.push(newLinkElement);
      if (index !== matchedResults.length - 1) {
        newTextArr.push(text.slice(frag.end, matchedResults[index + 1].start));
      } else {
        newTextArr.push(text.slice(frag.end, text.length));
      }
    }
  });

  return newTextArr;
};
