import { Link } from 'react-router-dom';
import css from './NavBar.module.css';

export default function NavBar() {
  return (
    <nav className={css.nav}>
      <ul className={css.navList}>
        <li>
          <Link to="/signin" className={css.navItem}>
            Sign In
          </Link>
        </li>
        <li>
          <Link to="/signup" className={css.navItem}>
            Sign Up
          </Link>
        </li>
        <li>
          <Link
            to="/signin"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/signin';
            }}
            className={css.navItem}
          >
            Вийти
          </Link>
        </li>
      </ul>
    </nav>
  );
}
