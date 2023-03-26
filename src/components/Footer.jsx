// Import
import { useSelector } from 'react-redux';
import '../styles/Footer.scss';

// Footer component
const Footer = () => {
  const {
    timer: { id },
  } = useSelector((state) => state);

  return (
    <div className={'bottom ' + (id ? 'hidden' : '')}>
      <span className="hint">Press <kbd>Tab</kbd> to restart</span>
      <footer>
        <span>
          created by {' '} <a target="_blank" rel="noreferrer" href="https://www.github.com/onenylxus">onenylxus</a>
        </span>
      </footer>
    </div>
  );
};

// Export
export default Footer;
