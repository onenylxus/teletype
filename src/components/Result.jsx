// Import
import { useSelector } from 'react-redux';
import { reset } from '../services/reset';
import '../styles/Result.scss';

// Result component
const Result = () => {
  const {
    pref: { limit },
    tester: { list, history },
  } = useSelector((state) => state);

  const result = history.map((word, i) => word === list[i]);
  let correct = 0;
  result.forEach((bool, i) => {
    correct += bool ? list[i].length : 0;
  });
  const wpm = (correct + result.filter((bool) => bool).length) * 12 / limit;

  return (
    <div className="result">
      <h1>{`${Math.round(wpm)} wpm`}</h1>
      <span>{result.filter((x) => x).length}/{result.filter((x) => !x).length} </span>
      <a onClick={() => reset()}>Restart</a>
    </div>
  );
};

// Export
export default Result;
