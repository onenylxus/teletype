import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTimerId } from './services/actions';
import { record } from './services/record';
import Footer from './components/Footer';
import Header from './components/Header';
import Result from './components/Result';
import Tester from './components/Tester';

export default function App() {
  const dispatch = useDispatch();
  const {
		timer: { now, id },
		tester: { current, typed, ref },
	} = useSelector((state) => state);

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Tab') {
        e.preventDefault();
        record(e.key);
      }
    };
    return () => { document.onkeydown = null; };
  }, [dispatch]);

  useEffect(() => {
    const index = typed.length - 1;
    const element = ref ? ref.current : null;

    if (element) {
      element.children[index + 1].classList.add(current[index] === typed[index] ? 'right' : 'wrong');
    }
  }, [current, typed, ref]);

  useEffect(() => {
    const index = typed.length;
    const element = ref ? ref.current : null;

    if (element && index < current.length) {
      element.children[index + 1].classList.remove('wrong', 'right');
    }
  }, [current.length, typed, ref]);

  useEffect(() => {
    if (now === 0 && id) {
      clearInterval(id);
      dispatch(setTimerId(null));
    }
  }, [dispatch, now, id]);

  return (
    <>
      <Header />
      {now > 0 ? <Tester /> : <Result />}
      <Footer />
    </>
  );
}
