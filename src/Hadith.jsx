import React from 'react';
import parse from 'html-react-parser';

export default function Hadith({ hadith, setCurrentComp }) {
  return (
    <>
      <div className="hadith">
        <h2 className="title">প্রতি মুহূর্তে হাদীস</h2>
        <h4 className="topic">
          {hadith.topicName && 'পরিচ্ছেদঃ ' + parse(`${hadith.topicName}`)}
        </h4>
        <p className="arabic">{parse(`${hadith.hadithArabic}`)}</p>
        <p className="bangla">{parse(`${hadith.hadithBengali}`)}</p>
        <p className="english">{parse(`${hadith.hadithEnglish}`)}</p>

        <p className="book">বইঃ {parse(`${hadith.book}`)}</p>
        <p className="chapter">অধ্যায়ঃ {parse(`${hadith.chapter}`)}</p>
      </div>
      <button className="historyBtn" onClick={() => setCurrentComp('history')}>
        Show History
      </button>
    </>
  );
}
