import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';

export default function Histories({ getThisHadith, setCurrentComp }) {
  const [histories, setHistories] = useState({});

  useEffect(() => {
    let localHistories = localStorage['hadithHistory'] ?? false;
    localHistories = localHistories ? JSON.parse(localHistories) : {};

    setHistories(localHistories);
  }, []);

  return (
    <>
      <ul className="histories">
        {Object.keys(histories).length ? (
          Object.keys(histories).map(function(key, index) {
            let history = histories[key];
            return (
              <li
                key={index}
                onClick={() => {
                  getThisHadith(
                    history.book_key,
                    history.chapterID,
                    history.hadithNo
                  );
                  setCurrentComp('hadith');
                }}
              >
                {index}.{' '}
                {history.topic ? parse(history.topic) : history.hadithNo}
              </li>
            );
          })
        ) : (
          <li>No History</li>
        )}
      </ul>
      <button className="historyBtn" onClick={() => setCurrentComp('hadith')}>
        Show Hadith
      </button>
    </>
  );
}
