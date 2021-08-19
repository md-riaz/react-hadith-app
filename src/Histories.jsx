import React from 'react';
import parse from 'html-react-parser';

export default function Histories({
  getThisHadith,
  setCurrentComp,
  histories,
  deleteHistories
}) {
  return (
    <>
      <table>
        <tbody>
          {Object.keys(histories).length ? (
            Object.keys(histories).map(function(key, index) {
              let history = histories[key];
              return (
                <tr>
                  <td>{index}</td>
                  <td
                    onClick={() => {
                      getThisHadith(
                        history.book_key,
                        history.chapterID,
                        history.hadithNo
                      );
                      setCurrentComp('hadith');
                    }}
                  >
                    {history.topic ? parse(history.topic) : history.hadithNo}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colspan="15" className="text-center">
                No History
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="text-center" style={{ marginTop: '15px' }}>
        <button
          className="btn btn-green"
          onClick={() => setCurrentComp('hadith')}
        >
          Show Hadith
        </button>

        <button className="btn btn-red" onClick={() => deleteHistories()}>
          Delete History
        </button>
      </div>
    </>
  );
}
