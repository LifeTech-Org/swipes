const getInfo = () => {
  const info = [
    "You can always swipe left and right to see Swipes across different days.",
    "As long as you are signed in with your Google account, you can always pick up exactly where you left.",
    "When you are signed in, you get the chance to express your reaction towards a Swipe by either liking or disliking it.",
    "For users using physical keyboard, you can always use the left and right arrow keys to move between Swipe",
    "You are free to call it Meme, but we call it Swipe, one thing though, you're gonna love it!",
    "Soon, you'll have the chance to select the category of Swipes you want to see, isn't that amazing?",
    "Ads is the major way I can get a coffee to keep my blood running. But we promise you, it won't be disturbing, Never!",
    "When you are signed in, You can always easily download any Swipe to your local storage for further sharing to friends and loved ones.",
    "Signing in offers a lot of edge, its risk free, and your details are safe and secure with Google.",
    "The owner of this website is a profesional web developer, You can make him happy by hiring him to work on your website.",
  ];
  const randomInt = Math.floor(Math.random() * info.length);
  return info[randomInt];
};

export default getInfo;
