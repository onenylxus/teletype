import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setType, setLimit, setTheme, setTimer, setList } from '../services/actions';
import library from '../library.json';
import '../styles/Header.scss';

export const pref = {
  type: ['words'],
  limit: [15, 30, 60, 90, 120],
  theme: ['default']
};

export default function Header() {
  const {
    pref: { type, limit, theme },
    timer: { id },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    const type = localStorage.getItem('type') || 'words';
    const limit = +localStorage.getItem('limit') || 60;
    const theme = localStorage.getItem('theme') || 'default';

    dispatch(setType(type));
    dispatch(setLimit(limit));
    dispatch(setTheme(theme));

    dispatch(setList(library[type]));
    dispatch(setTimer(limit));
  }, [dispatch]);

  return (
    <header>
      <a href="." className="logo">teletype</a>
    </header>
  );
}
