import React from 'react';

export default function Histories({ getThisHadith, setCurrentComp }) {
  const storageHistories = JSON.parse(localStorage['hadithHistory']);

  return (
    <>
      <ul className="histories">
        {Object.keys(storageHistories).length ? (
          Object.keys(storageHistories).map(function(key, index) {
            let hadith = storageHistories[key];
            return (
              <li
                key={index}
                onClick={() =>
                  getThisHadith(
                    hadith.book_key,
                    hadith.chapterID,
                    hadith.hadithNo
                  ) && setCurrentComp('hadith')
                }
              >
                {index}. {hadith.topic ? hadith.topic : hadith.hadithNo}
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