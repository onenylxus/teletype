import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setType, setLimit, setTheme, setTimer, setList } from '../services/actions';
import { reset } from '../services/reset';
import library from '../library.json';
import '../styles/Header.scss';

export const pref = {
  type: ['words'],
  limit: [15, 30, 60, 90, 120],
  theme: ['dark', 'light']
};

export default function Header() {
  const {
    pref: { type, limit, theme },
    timer: { id },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  const toggleType = () => {
    const i = (pref.type.indexOf(type) + 1) % pref.type.length;
    dispatch(setType(pref.type[i]), [dispatch, type]);
    localStorage.setItem('type', type);
    reset();
  };

  const toggleLimit = () => {
    const i = (pref.limit.indexOf(limit) + 1) % pref.limit.length;
    dispatch(setLimit(pref.limit[i]), [dispatch, limit]);
    localStorage.setItem('limit', limit);
    reset();
  };

  const toggleTheme = () => {
    const i = (pref.theme.indexOf(theme) + 1) % pref.theme.length;
    dispatch(setTheme(pref.theme[i]), [dispatch, theme]);
    localStorage.setItem('theme', theme);
  };

  useEffect(() => {
    if (theme !== '') {
      document.body.children[1].classList.remove(...pref.theme);
      document.body.children[1].classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const type = localStorage.getItem('type') || 'words';
    const limit = +localStorage.getItem('limit') || 60;
    const theme = localStorage.getItem('theme') || 'dark';

    dispatch(setType(type));
    dispatch(setLimit(limit));
    dispatch(setTheme(theme));

    dispatch(setList(library[type]));
    dispatch(setTimer(limit));
  }, [dispatch]);

  return (
    <header className={id ? 'hidden' : ''}>
      <a href="." className="logo">teletype</a>
      <div className="options">
        <div className="type" key="type">type<button className="option" onClick={(e) => toggleType(e)}>{type}</button></div>
        <div className="limit" key="limit">time<button className="option" onClick={(e) => toggleLimit(e)}>{limit}</button></div>
        <div className="theme" key="theme">theme<button className="option" onClick={(e) => toggleTheme(e)}>{theme}</button></div>
      </div>
    </header>
  );
}
