import { Link } from 'react-router-dom';
import css from './NavBar.module.css';

export default function NavBar() {
  return (
    <nav className={css.nav}>
      <ul>
        <li>
          <Link to="/signin">Sign In</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}
