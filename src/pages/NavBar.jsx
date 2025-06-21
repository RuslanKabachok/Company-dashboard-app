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
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/signin';
          }}
          style={{
            marginBottom: '10px',
            padding: '8px 12px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Вийти
        </button>
      </ul>
    </nav>
  );
}
