import { Link } from "@chakra-ui/layout";
import { ReactElement } from "react";
import { Mention } from "../pages";

type Reference = {
  ref: string;
  start: number;
  end: number;
  mention?: true;
  hash?: true;
  url?: true;
};

export const referenceSplitter = (text: string, mentions?: Array<Mention>) => {
  let newTextArr: Array<string | ReactElement> = [];
  const mentionsArr: Reference[] =
    mentions?.map((mention) => ({
      ref: "@" + mention.username,
      start: mention.start,
      end: mention.end,
      mention: true,
    })) ?? [];
  const hashArr = hashFinder(text);
  const urlArr = urlFinder(text);
  const combinedArr = [...mentionsArr, ...hashArr, ...urlArr].sort(
    (ref1, ref2) => ref1.start - ref2.start
  );
  if (combinedArr.length > 0) {
    combinedArr.forEach((ref, index) => {
      //First ref
      if (index === 0) {
        newTextArr.push(text.slice(0, ref.start));
      }
      const href = ref.hash
        ? "https://twitter.com/hashtag/" + ref.ref.slice(1, ref.ref.length)
        : ref.url
        ? ref.ref
        : "https://twitter.com/" + ref.ref;
      //Every ref
      const newLinkElement = (
        <Link
          color="blue.300"
          _hover={{ textDecoration: "none" }}
          _focus={{ outline: 0 }}
          target="_blank"
          href={href}
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
  let hashArr: Reference[] = [];
  let ref;
  while ((ref = reg.exec(text)) !== null) {
    hashArr.push({
      ref: ref[0],
      start: ref.index,
      end: reg.lastIndex,
      hash: true,
    });
  }

  return hashArr;
};

const urlFinder = (text: string) => {
  const reg =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;
  let urlArr: Reference[] = [];
  let ref;
  while ((ref = reg.exec(text)) !== null) {
    urlArr.push({
      ref: ref[0],
      start: ref.index,
      end: reg.lastIndex,
      url: true,
    });
  }
  return urlArr;
};
