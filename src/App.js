import React, { useState, useEffect } from 'react';
import Hadith from './Hadith';
import Histories from './Histories';

import './assets/css/style.scss';
import refresh from './assets/img/refresh.svg';

export default function App() {
  const [hadith, setHadith] = useState([]);
  const [histories, setHistories] = useState({});
  const [loader, setLoader] = useState(true);
  const [currentComp, setCurrentComp] = useState('hadith');

  // get random hadith from api
  const getHadiths = async function() {
    setLoader(true);

    // get all available books
    let books = await fetch('https://alquranbd.com/api/hadith').then(res =>
      res.json().then(books => books.filter(item => item.book_key != ''))
    );
    let randomBook = books[Math.floor(Math.random() * books.length)];

    // get all available chapters from the random book
    let chapters = await fetch(
      `https://alquranbd.com/api/hadith/${randomBook['book_key']}`
    ).then(res => res.json());
    let randomChapter = chapters[Math.floor(Math.random() * chapters.length)];

    // get all available hadith from the random chapter
    let hadiths = await fetch(
      `https://alquranbd.com/api/hadith/${randomBook['book_key']}/${
        randomChapter['chSerial']
      }`
    ).then(res => res.json());
    let randomHadith = hadiths[Math.floor(Math.random() * hadiths.length)];

    let hadith = {
      topicName: randomHadith['topicName'],
      book: randomBook['nameBengali'],
      chapter: randomChapter['nameBengali'],
      hadithArabic: randomHadith['hadithArabic'],
      hadithEnglish: randomHadith['hadithEnglish'],
      hadithBengali: randomHadith['hadithBengali']
    };

    setHadith(hadith);
    setLoader(false);

    // set url for this hadith
    setHadithURL(
      randomBook['book_key'],
      randomChapter['chSerial'],
      randomHadith['hadithNo']
    );

    // save uri to localStorage
    saveHistory(
      randomHadith['topicName'],
      randomBook['book_key'],
      randomChapter['chSerial'],
      randomHadith['hadithNo']
    );
  };

  // set hadith info in url
  const setHadithURL = (book_key, chapterID, hadithNo) => {
    window.history.pushState(
      '',
      'Hadith',
      `/?book_key=${book_key}&chapterID=${chapterID}&hadith=${hadithNo}`
    );
  };

  // get single hadith from parameters
  const getThisHadith = async (book_key, chapterID, hadithNo) => {
    setLoader(true);

    // book
    let books = await fetch('https://alquranbd.com/api/hadith').then(res =>
      res.json()
    );
    let urlBook = books.find(b => b.book_key === book_key);

    // chapter
    let chapters = await fetch(
      `https://alquranbd.com/api/hadith/${book_key}`
    ).then(res => res.json());
    let urlChapter = chapters.find(c => c.chSerial === chapterID);

    let hadiths = await fetch(
      `https://alquranbd.com/api/hadith/${book_key}/${chapterID}`
    ).then(res => res.json());

    let urlHadith = hadiths.find(h => h.hadithNo === hadithNo);
    let hadith = {
      topicName: urlHadith['topicName'],
      book: urlBook['nameBengali'],
      chapter: urlChapter['nameBengali'],
      hadithArabic: urlHadith['hadithArabic'],
      hadithEnglish: urlHadith['hadithEnglish'],
      hadithBengali: urlHadith['hadithBengali']
    };

    setHadith(hadith);
    setLoader(false);

    // save uri to localStorage
    saveHistory(urlHadith['topicName'], book_key, chapterID, hadithNo);
  };

  // save current hadith to localStorage
  const saveHistory = (topic, book_key, chapterID, hadithNo) => {
    let localHistories = localStorage['hadithHistory'] ?? false;

    let historyOBJ = localHistories ? JSON.parse(localHistories) : {};

    historyOBJ[hadithNo] = {
      topic: topic,
      book_key: book_key,
      chapterID: chapterID,
      hadithNo: hadithNo,
      time: Date.now()
    };

    localStorage.setItem('hadithHistory', JSON.stringify(historyOBJ));
    getHistories();
  };

  // get Histories from localStorage and send to state
  const getHistories = () => {
    let localHistories = localStorage['hadithHistory'] ?? false;
    localHistories = localHistories ? JSON.parse(localHistories) : {};

    let sortedHistories = Object.entries(localHistories)
      .sort((a, b) => b[1].time - a[1].time)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    setHistories(sortedHistories);
  };

  useEffect(() => {
    let urlParams = new URLSearchParams(location.search);

    if (
      urlParams.get('book_key') &&
      urlParams.get('chapterID') &&
      urlParams.get('hadith')
    ) {
      getThisHadith(
        urlParams.get('book_key'),
        urlParams.get('chapterID'),
        urlParams.get('hadith')
      );
    } else {
      getHadiths();
    }

    // get histories to state
    getHistories();
  }, []);

  return (
    <>
      {loader ? (
        <div className="pageLoader" />
      ) : (
        <>
          <div className="pageLoader" />
          {currentComp === 'hadith' && (
            <Hadith hadith={hadith} setCurrentComp={setCurrentComp} />
          )}
          {currentComp === 'history' && (
            <Histories
              getThisHadith={getThisHadith}
              setCurrentComp={setCurrentComp}
              histories={histories}
            />
          )}

          <div
            className="reload"
            onClick={() => getHadiths() && setCurrentComp('hadith')}
          >
            <img src={refresh} alt="reload" />
          </div>
        </>
      )}
    </>
  );
}
