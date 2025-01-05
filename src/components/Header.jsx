// Import
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setType, setLimit, setTheme, setTimer, setList } from '../services/actions';
import { reset } from '../services/reset';
import library from '../library.json';
import '../styles/Header.scss';

// Typing mode preference
export const pref = {
  type: Object.keys(library),
  limit: [15, 30, 60, 90, 120],
  theme: ['dark', 'light']
};

// Header component
const Header = () => {
  const {
    pref: { type, limit, theme },
    timer: { id },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  const toggleType = () => {
    const i = (pref.type.indexOf(type) + 1) % pref.type.length;
    dispatch(setType(pref.type[i]), [dispatch, type]);
    localStorage.setItem('type', pref.type[i]);
    reset();
  };

  const toggleLimit = () => {
    const i = (pref.limit.indexOf(limit) + 1) % pref.limit.length;
    dispatch(setLimit(pref.limit[i]), [dispatch, limit]);
    localStorage.setItem('limit', pref.limit[i]);
    reset();
  };

  const toggleTheme = () => {
    const i = (pref.theme.indexOf(theme) + 1) % pref.theme.length;
    dispatch(setTheme(pref.theme[i]), [dispatch, theme]);
    localStorage.setItem('theme', pref.theme[i]);
  };

  useEffect(() => {
    if (theme !== '') {
      document.body.children[1].classList.remove(...pref.theme);
      document.body.children[1].classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    let type = 'words';
    if (pref.type.includes(localStorage.getItem('type'))) {
      type = localStorage.getItem('type');
    } else {
      localStorage.setItem('type', type);
    }
    dispatch(setType(type));

    let limit = 60;
    if (pref.limit.includes(localStorage.getItem('limit'))) {
      limit = localStorage.getItem('limit');
    } else {
      localStorage.setItem('limit', limit);
    }
    dispatch(setLimit(limit));

    let theme = 'dark';
    if (pref.theme.includes(localStorage.getItem('theme'))) {
      theme = localStorage.getItem('theme');
    } else {
      localStorage.setItem('theme', theme);
    }
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
};

// Export
export default Header;
