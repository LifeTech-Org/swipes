import { useContext, useEffect, useState } from "react";
import { tns } from "tiny-slider";
import {
  ArrowBackIos,
  ArrowForwardIos,
  ArrowLeftRounded,
  ArrowRightRounded,
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
import { IconButton, Skeleton } from "@mui/material";
const Main = () => {
  const [swipes, setSwipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { uid } = useContext(AppContext) || { uid: null };
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
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
    return () => unSubscribe();
  }, [date]);
  return (
    <main className="flex-1 flex flex-col p-3 bg-slate-900 rounded-lg">
      <ToolBar {...{ date: date, setDate: setDate, setIsLoading }} />
      {isLoading ? (
        <>
          <Skeleton variant="rounded" height={"100%"} />
        </>
      ) : swipes.length === 0 ? (
        <div>
          Nothing to show yet. Check for other days. Swipe and smile (-_-)
        </div>
      ) : (
        <>
          <Swipes {...{ swipes, uid, currentIndex }} />
          {/* Shwow action bar only when there is slides */}
          {swipes.length > 0 && (
            <ActionBar {...{ swipes, uid, setCurrentIndex }} />
          )}
        </>
      )}
    </main>
  );
};

export default Main;

const Swipes = ({ uid, swipes, currentIndex }) => {
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

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center">
      <ul className="slides !h-full">
        {/* <li>
          <InfoSwipe />
        </li> */}
        {swipes.map(({ url, likes, dislikes, docID }) => (
          <div key={docID} className="relative">
            <li className="slider-item min-h-full w-full flex items-center justify-center ">
              <img src={url} title="meme" className="h-48 w-auto " />
            </li>
            {uid && (
              <div className="flex flex-col right-0 bg-green-300 h-28 absolute z-10 top-2">
                {[
                  { type: "likes", value: likes },
                  { type: "dislikes", value: dislikes },
                ].map(({ type, value }, index) => (
                  <ReactionButton
                    key={index}
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
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </ul>
      <div className="absolute bottom-5 left-4 right-4 flex gap-4">
        {swipes.map((_, index) => (
          <button
            className={
              currentIndex === index
                ? "h-1 flex-1 to-blue-500"
                : "h-1 flex-1 bg-gray-300"
            }
            key={index}
          ></button>
        ))}
      </div>
    </div>
  );
};

const ReactionButton = ({ func, existed, counts }) => {
  return (
    <button className="flex flex-col" onClick={func}>
      <ThumbUp className={existed ? "text-blue-600" : "text-white"} />
      <span>{counts}</span>
    </button>
  );
};

// InfoSwipe is the last swipe always at the end showing details of how the website was built and ...
////InfoSwipe
const InfoSwipe = () => {
  return <article>xcscd</article>;
};

////ToolBar
const ToolBar = ({ date, setDate, setIsLoading }) => {
  return (
    <div className="h-11 flex items-center">
      <IconButton
        onClick={() => {
          setIsLoading(true);
          setDate((_date) => {
            const dateObj = new Date(_date);
            dateObj.setDate(dateObj.getDate() - 1);
            setDate(dateObj.toLocaleDateString("en-CA"));
          });
        }}
        color="primary"
        size="small"
      >
        <ArrowLeftRounded fontSize="large" />
      </IconButton>

      <input
        type="date"
        title="choose date"
        className="bg-transparent text-gray-50 text-xs"
        value={date}
        onChange={(e) => {
          setIsLoading(true);
          setDate(e.target.value);
        }}
      />
      <IconButton
        onClick={() => {
          setIsLoading(true);
          setDate((_date) => {
            const dateObj = new Date(_date);
            dateObj.setDate(dateObj.getDate() + 1);
            setDate(dateObj.toLocaleDateString("en-CA"));
          });
        }}
        color="primary"
        size="small"
      >
        <ArrowRightRounded fontSize="large" />
      </IconButton>
    </div>
  );
};

////ActionBar
const ActionBar = ({ swipes, uid, setCurrentIndex }) => {
  const user = useContext(AppContext);
  return (
    <div className="h-11 flex items-center justify-between">
      {user !== null ? (
        <div>you are signed in</div>
      ) : (
        <div>Sign in to do more.</div>
      )}
      <SwipeActions {...{ swipes, uid, setCurrentIndex }} />
    </div>
  );
};

const SwipeActions = ({ swipes, uid, setCurrentIndex }) => {
  useEffect(() => {
    const slider = tns({
      container: ".slides",
      mouseDrag: true,
      items: 1,
      slideBy: 1,
      controls: false,
      nav: false,
      autoplayButtonOutput: false,
      autoplay: false,
      autoHeight: false,
    });
    document.getElementById("next").addEventListener("click", () => {
      slider.goTo("next");
    });
    document.getElementById("prev").addEventListener("click", () => {
      slider.goTo("prev");
    });
    slider.events.on("indexChanged", (e) => {
      if (e.index <= Array.from(swipes).length) {
        setCurrentIndex(e.index - 1);
      }
    });
  }, []);
  return (
    <div className="flex controls" id="controls">
      <button id="prev">
        <ArrowBackIos />
      </button>
      <button id="next">
        <ArrowForwardIos />
      </button>
    </div>
  );
};
