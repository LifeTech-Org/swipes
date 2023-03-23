import One from "../assets/One.png";
import Two from "../assets/Two.png";
import Three from "../assets/Three.png";
import Four from "../assets/Four.png";
import Five from "../assets/Five.png";
import Six from "../assets/Six.png";
import { useContext, useEffect, useState } from "react";
import { tns } from "tiny-slider";
import { Button } from "@mui/material";
import {
  ArrowBackIos,
  ArrowBackIosNew,
  ArrowForwardIos,
  ThumbDown,
  ThumbUp,
} from "@mui/icons-material";
import AppContext from "../utils/app-context";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
const Main = () => {
  const [swipes, setSwipes] = useState([]);
  const { uid } = useContext(AppContext) || { uid: null };
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  useEffect(() => {
    const unSubscribe = onSnapshot(
      query(collection(db, "swipes"), where("date", "==", date)),
      (snapshot) => {
        const dummy = [];
        snapshot.forEach((result) =>
          dummy.push({ docID: result.id, ...result.data() })
        );
        setSwipes(dummy);
      }
    );
    return () => unSubscribe();
  }, [date]);
  return (
    <main className="flex-1 flex flex-col p-3 bg-slate-900 rounded-lg">
      <ToolBar {...{ date: date, setDate: setDate }} />
      <Swipes {...{ swipes, uid }} />
      <ActionBar {...{ swipes, uid }} />
    </main>
  );
};

export default Main;

const Swipes = ({ uid, swipes }) => {
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
          <button className="h-1 flex-1 bg-blue-300" key={index}></button>
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
const ToolBar = ({ date, setDate }) => {
  return (
    <div className="h-11 flex items-center">
      <input
        type="date"
        title="choose date"
        className="bg-transparent text-gray-50 text-xs"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button className="text-xs text-white bg-blue-700 px-4 py-2 rounded-sm ">
        Refresh
      </button>
    </div>
  );
};

////ActionBar
const ActionBar = ({ swipes, uid }) => {
  const user = useContext(AppContext);
  return (
    <div className="h-11 flex items-center justify-between">
      {user !== null ? (
        <div>you are signed in</div>
      ) : (
        <div>Sign in to do more.</div>
      )}
      <SwipeActions {...{ swipes, uid }} />
    </div>
  );
};

const SwipeActions = ({ swipes, uid }) => {
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
    return () => {
      document.getElementById("next").removeEventListener("click", () => {
        slider.goTo("next");
      });
      document.getElementById("prev").removeEventListener("click", () => {
        slider.goTo("prev");
      });
    };
  }, [swipes, uid]);
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
