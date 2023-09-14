// import useContext
import { useContext } from 'react';
// import Context
import Context from '../Context';
// import react router
import { useNavigate } from 'react-router-dom';
// import Home from './components/Home';
// import logo white
// import logoWhite from '../logo_white.png';

function Header() {
  const { user, setUser } = useContext(Context);
  const navigate = useNavigate();

  /**
   * logout
   */
  const logout = () => {
    const isLogout = window.confirm('Do you want to log out ?');
    if (isLogout) {
      // remove local storage.
      localStorage.removeItem('auth');
      // remove authenticated user from context.
      setUser(null);
      // redirect to login page.
      navigate('/login');
    }
  }

  const home = () => {
    navigate('/')
  }

  const seeProfile = () => {
      const isSeeProfile = window.confirm('Do you want to see your profile ?');
      if (isSeeProfile) {
        localStorage.setItem("auth", JSON.stringify(user));
        setUser(user);
        // redirect to profile page.
        navigate('/profile');
      }
    }

  console.log(user);

  return (
    <div className="header">
      <div className="header__left">
        {/* <img src={logoWhite} alt="Uber Clone" /> */}
        <div className="title"  onClick={home}>Bloblocor</div>
        {
           user && (
            <div className="header__right" onClick={seeProfile}>
              <img src={user.avatar} alt={user.email} />
              <span className ="hello" >Hello {user.email}</span>
            </div>
          )
        }
      </div>
      <span className="header__logout" onClick={logout}><span id="btnlogout">Logout</span></span>
    </div>

  );
}

export default Header;