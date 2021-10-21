import { Link } from "@chakra-ui/layout";
import { ReactElement } from "react";
import { Mention } from "../pages";

export const referenceSplitter = (text: string, mentions?: Array<Mention>) => {
  let newTextArr: Array<string | ReactElement> = mentionHashSplitter(
    text,
    mentions
  );

  return newTextArr;
};

const mentionHashSplitter = (text: string, mentions?: Array<Mention>) => {
  let newTextArr: Array<string | ReactElement> = [];
  const mentionsArr =
    mentions?.map((mention) => ({
      ref: "@" + mention.username,
      start: mention.start,
      end: mention.end,
    })) ?? [];
  const hashArr = hashFinder(text);
  const combinedArr = [...mentionsArr, ...hashArr].sort(
    (ref1, ref2) => ref1.start - ref2.start
  );
  if (combinedArr.length > 0) {
    combinedArr.forEach((ref, index) => {
      //First ref
      if (index === 0) {
        newTextArr.push(text.slice(0, ref.start));
      }
      //Every ref

      const newLinkElement = (
        <Link
          color="blue.300"
          _hover={{ textDecoration: "none" }}
          _focus={{ outline: 0 }}
          target="_blank"
          href={
            ref.ref[0] === "#"
              ? "https://twitter.com/hashtag/" +
                ref.ref.slice(1, ref.ref.length)
              : "https://twitter.com/" + ref.ref
          }
        >
          {ref.ref}
        </Link>
      );

      newTextArr.push(newLinkElement);

      //Last Ref
      if (index === combinedArr.length - 1) {
        newTextArr.push(text.slice(ref.end, text.length));

        //Mid ref
      } else {
        newTextArr.push(text.slice(ref.end, combinedArr[index + 1].start));
      }
    });
  } else {
    newTextArr = [text];
  }
  return newTextArr;
};

const hashFinder = (text: string) => {
  const reg = /\#[^\`\!\@\#\$\%\^\&\*\(\)\[\]\s]*/g;
  let hashArr: { ref: any; start: number; end: number }[] = [];
  let ref;
  while ((ref = reg.exec(text)) !== null) {
    hashArr.push({
      ref: ref[0],
      start: ref.index,
      end: reg.lastIndex,
    });
  }

  return hashArr;
};
