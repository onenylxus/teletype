// Import
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRef, setCaretRef } from '../services/actions';
import '../styles/Tester.scss';

// Tester component
const Tester = () => {
  const {
    timer: { now },
    tester: { list, history, current, typed },
  } = useSelector((state) => state);
  const extra = typed.slice(current.length).split('');

  const dispatch = useDispatch();
  const ref = useRef(null);
  const caretRef = useRef(null);

  useEffect(() => {
    dispatch(setRef(ref));
    dispatch(setCaretRef(caretRef));
  }, [dispatch]);

  return (
    <div className="tester">
      <div className="timer">{now}</div>
      <div className="input">
        {list.map((word, index) => {
          const i = word + index;
          const bool = current + list.indexOf(current, history.length) === i;
          return (
            <div className="word" ref={bool ? ref : null} key={i}>
              {bool ? <span className="blink" style={{ left: typed.length * 16.81 }} ref={caretRef} id="caret">|</span> : null}
              {word.split('').map((char, charIndex) => <span key={char + charIndex}>{char}</span>)}
              {bool ? extra.map((char, charIndex) => <span className="wrong extra" key={char + charIndex}>{char}</span>) : history[index] ? history[index].slice(list[index].length).split('').map((char, charIndex) => <span className="wrong extra" key={char + charIndex}>{char}</span>) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Export
export default Tester;
