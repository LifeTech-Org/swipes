import { useState, useEffect } from "react";
import ArrowKeysReact from "arrow-keys-react";
import SwipeReact from "swipe-react";

const Slides = ({ uid, onMount, startIndex, slides, communicateIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [imgIsLoaded, setImgIsLoaded] = useState(false);
  const { url, seen } = Array.from(slides)[currentIndex];
  const changeIndex = ({ type }) => {
    const newIndex =
      type === "next"
        ? currentIndex < Array.from(slides).length - 1
          ? currentIndex + 1
          : 0
        : currentIndex === 0
        ? Array.from(slides).length - 1
        : currentIndex - 1;
    if (communicateIndex) {
      communicateIndex(newIndex);
    }
    setCurrentIndex(newIndex);
  };
  useEffect(() => {
    setImgIsLoaded(false);
    if (uid) {
      onMount(currentIndex);
    }
    ArrowKeysReact.config({
      left: () => {
        setImgIsLoaded(false);
        changeIndex({ type: "prev" });
      },
      right: () => {
        setImgIsLoaded(false);
        changeIndex({ type: "next" });
      },
    });
  }, [currentIndex]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center outline-none"
      style={{ height: "65vh" }}
      {...ArrowKeysReact.events}
      tabIndex={1}
    >
      <div className="absolute flex top-4 left-8 right-8">
        {Array.from(slides).map((_, index) => (
          <div
            key={index}
            className={
              (index === currentIndex
                ? "bg-blue-500 "
                : Array.from(Array.from(slides)[index].seen).includes(uid)
                ? "bg-gray-300 "
                : "bg-blue-300 ") + "flex-1 mx-2 h-1 w-8 rounded-sm "
            }
          ></div>
        ))}
      </div>
      <img
        src={Array.from(slides)[currentIndex].url}
        alt="meme"
        className={
          (imgIsLoaded ? "fade-in " : "") +
          "w-auto h-auto max-w-full max-h-full"
        }
        onLoad={() => {
          setImgIsLoaded(true);
        }}
        style={{ display: imgIsLoaded ? "inline-flex" : "none" }}
      />
      {!imgIsLoaded && (
        <div>
          <span className="relative flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
          </span>
        </div>
      )}
      {Array.from(slides).length > 1 && (
        <>
          <button
            onClick={() => {
              changeIndex({ type: "prev" });
            }}
            className="absolute top-0 left-0 bottom-0 w-1/4 bg-transparent cursor-pointer outline-none active:outline-none"
          ></button>
          <button
            onClick={() => {
              changeIndex({ type: "next" });
            }}
            className="absolute top-0 right-0 bottom-0 w-1/4  bg-transparent cursor-pointer outline-none active:outline-none"
          ></button>
        </>
      )}
    </div>
  );
};

export default Slides;
