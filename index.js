'use strict';

const { createElement, useState } = React;

let recognition = null;

const start = (setListenState, setSpeech) => {
  console.log('[START]start');

  const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

  recognition = new SpeechRecognition();
  recognition.lang = 'ja-JP';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onresult = (event) => {
    console.log(event);
    const resultList = [];
    for (const result of event.results) {
      resultList.push(result);
    }

    const speechList = resultList.filter((result) => {
      return result.isFinal;
    }).map((result) => {
      return result[0].transcript;    
    });

    setSpeech(speechList);
  };
  recognition.onend = () => {
    console.log('onend');
    setListenState("ready");
  };
  recognition.onerror = (event) => {
    console.error(event);
    setListenState("ready");
  };

  recognition.start();

  setListenState("listening");

  console.log('[END]start');
};

const stop = (setListenState) => {
  recognition.stop();
  setListenState("ready");
};

const clear = (setListenState, setSpeechList) => {
  setSpeechList([]);
  setListenState("ready");
};

const Page = () => {
  const [listenState, setListenState] = useState("ready");
  const [speechList, setSpeechList] = useState([]);
  const [aiSummary, setAiSummary] = useState("");

  return (
    <div>
      {
        listenState === "ready" ?
          <button onClick={() => {start(setListenState, setSpeechList)}} className="uk-button uk-button-default"><span uk-icon="microphone"></span>聞き取り開始</button>
          :
          <button onClick={() => {stop(setListenState)}} className="uk-button uk-button-default"><span uk-icon="microphone"></span>聞き取り中...</button>
      }
      {
        listenState === "ready" ?
          <button onClick={() => {clear(setListenState, setSpeechList)}} className="uk-button uk-button-default"><span uk-icon="trash"></span>クリア</button>
          :
          <button className="uk-button uk-button-default" disabled><span uk-icon="trash"></span>クリア</button>
      }


      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="form-stacked-text">聞き取り結果</label>
        <div className="uk-form-controls">
          <textarea className="uk-textarea" value={speechList.join(" ")} disabled></textarea>
        </div>
      </div>

      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="form-stacked-text">AI要約</label>
        <div className="uk-form-controls">
          <textarea className="uk-textarea" value={aiSummary} disabled></textarea>
        </div>
      </div>
    </div>
  );
}

const domContainer = document.querySelector('#root-render');
const root = ReactDOM.createRoot(domContainer);
root.render(createElement(Page));
