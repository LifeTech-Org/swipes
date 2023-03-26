import React, { useContext, useEffect, useState } from "react";
import Stories from "react-insta-stories";
import { tns } from "tiny-slider";
import {
  ArrowBackIos,
  ArrowForwardIos,
  ArrowLeftRounded,
  ArrowRightRounded,
  Download,
  ThumbDown,
  ThumbUp,
} from "@mui/icons-material";
import AppContext from "../utils/app-context";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { CircularProgress, IconButton, Skeleton } from "@mui/material";
import Slides from "./Slides";
import Empty from "../assets/imgs/empty.svg";
import download from "downloadjs";
import { getNextDate, getPreviousDate, getToday } from "../utils/date";
import SwipeReact from "swipe-react";
const Main = () => {
  const [swipes, setSwipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { uid } = useContext(AppContext) || { uid: null };
  const [date, setDate] = useState(getToday());
  useEffect(() => {
    setIsLoading(true);
    const unSubscribe = onSnapshot(
      query(collection(db, "swipes"), where("date", "==", date)),
      (snapshot) => {
        const dummy = [];
        snapshot.forEach((result) =>
          dummy.push({ docID: result.id, ...result.data() })
        );
        setSwipes(dummy);
        setIsLoading(false);
      }
    );
    SwipeReact.config({
      right: () => {
        setDate(getPreviousDate(date));
      },
      left: () => {
        setDate(getNextDate(date));
      },
    });
    return () => unSubscribe();
  }, [date]);
  return (
    <main
      className="flex-1 flex flex-col py-3 bg-gray-900 shadow-lg rounded-lg "
      style={{ height: "65vh" }}
      {...SwipeReact.events}
    >
      <ToolBar {...{ date: date, setDate: setDate }} />
      {isLoading ? (
        <div
          className="flex items-center justify-center w-full h-full"
          style={{ height: "65vh" }}
        >
          <CircularProgress />
        </div>
      ) : swipes.length === 0 ? (
        <article
          className="flex flex-col gap-8 items-center justify-center"
          style={{ height: "65vh" }}
        >
          <img
            src={Empty}
            alt="no result"
            className="animate-bounce h-32 w-auto"
          />
          <p className="text-xs text-blue-200 max-w-xs px-4 text-center">
            Nothing here for this day, check back later or check other days.
            <br /> (-_-)
          </p>
        </article>
      ) : (
        <>
          <Swipes {...{ swipes, uid, date, setDate }} />
        </>
      )}
    </main>
  );
};

export default Main;

const Swipes = ({ uid, swipes, date, setDate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { likes, dislikes, docID, url, seen } =
    Array.from(swipes)[currentIndex];
  const reactToSwipe = async ({ type, docID, uid, existed }) => {
    const newData =
      type === "likes"
        ? existed
          ? { likes: arrayRemove(uid) }
          : {
              likes: arrayUnion(uid),
              dislikes: arrayRemove(uid),
            }
        : existed
        ? {
            dislikes: arrayRemove(uid),
          }
        : {
            dislikes: arrayUnion(uid),
            likes: arrayRemove(uid),
          };
    await updateDoc(doc(db, "swipes", docID), newData)
      .then(() => {})
      .catch(() => {});
  };

  const handleUpdateSeenSwipe = async (index) => {
    const { docID, seen } = Array.from(swipes)[index];
    if (Array.from(seen).includes(uid)) {
      return;
    }
    await updateDoc(doc(db, "swipes", docID), {
      seen: arrayUnion(uid),
    });
  };

  const getStartIndex = () => {
    const lastSeenIndex = Array.from(swipes).findIndex(
      ({ seen }) => !Array.from(seen).includes(uid)
    );
    return lastSeenIndex === -1 ? 0 : lastSeenIndex;
  };
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center">
      <Slides
        uid={uid}
        startIndex={uid ? getStartIndex() : 0}
        slides={swipes}
        communicateIndex={(newIndex) => {
          setCurrentIndex(newIndex);
        }}
        onMount={handleUpdateSeenSwipe}
      />
      {uid && (
        <div className="flex left-0 right-0 absolute bottom-2 z-10 items-center justify-center">
          <div className="bg-blue-100 h-fit py-1 rounded-full text-blue-700 flex w-44 justify-center items-center shadow-md">
            {[
              { type: "dislikes", value: dislikes, icon: ThumbDown },
              { type: "likes", value: likes, icon: ThumbUp },
            ].map(({ type, value, icon }, index) => {
              return (
                <React.Fragment key={index}>
                  <ReactionButton
                    counts={Array.from(value).length}
                    existed={Array.from(value).includes(uid)}
                    func={() =>
                      reactToSwipe({
                        type: type,
                        docID,
                        uid,
                        existed: Array.from(value).includes(uid),
                      })
                    }
                    Icon={icon}
                  />
                  {index === 0 && (
                    <button className="flex-1" onClick={() => download(url)}>
                      <Download></Download>
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ReactionButton = ({ func, existed, counts, Icon }) => {
  return (
    <button
      className="flex flex-col flex-1 justify-center items-center text-xs"
      onClick={func}
    >
      <Icon className={existed ? "text-blue-600" : "text-gray-600"} />
      <span>{counts}</span>
    </button>
  );
};

////ToolBar
const ToolBar = ({ date, setDate }) => {
  return (
    <div className="h-11 flex items-center">
      <IconButton
        onClick={() => {
          setDate((_date) => getPreviousDate(_date));
        }}
        color="primary"
        size="small"
      >
        <ArrowLeftRounded fontSize="large" />
      </IconButton>

      <input
        type="date"
        title="choose date"
        className="bg-transparent text-blue-300 bg-blue-100 px-4 py-2 rounded-md font-semibold text-xs outline-none min-w-fit"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
      />
      <IconButton
        onClick={() => {
          setDate((_date) => getNextDate(_date));
        }}
        color="primary"
        size="small"
      >
        <ArrowRightRounded fontSize="large" />
      </IconButton>
    </div>
  );
};
