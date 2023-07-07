'use strict';

const { createElement, useState } = React;

function LikeButton() {
  const [liked, setLiked] = useState(false);

  if (liked) {
    return 'You liked this.';
  }

  return (
    <button onClick={() => { setLiked(true); }}>
      Liked
    </button>
  );
}

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(createElement(LikeButton));
