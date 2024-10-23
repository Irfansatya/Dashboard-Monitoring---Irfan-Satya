import { Component, createSignal } from 'solid-js';
import styles from './homepage.module.css';
import logo from './asset/logo.svg';
import arrow from './asset/arrow.svg';
import gambarPanah from './asset/gambarPanah.svg';
import illustration from './asset/illustration.svg';
import Login from './login';
import Register from './register';
import LupaPassword from './lupapassword';
import Aktivasi from './aktivasi';

const Homepage: Component = () => {
  const [showLogin, setShowLogin] = createSignal(false);
  const [showRegister, setShowRegister] = createSignal(false);
  const [showForgotPassword, setShowForgotPassword] = createSignal(false);
  const [showAktivasiAkun, setShowAktivasiAkun] = createSignal(false);

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
    setShowForgotPassword(false);
    setShowAktivasiAkun(false);
};

const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
    setShowForgotPassword(false);
    setShowAktivasiAkun(false);
};

const handleAktivasiClick = () => {
  setShowAktivasiAkun(true);
  setShowLogin(false);
  setShowRegister(false);
  setShowForgotPassword(false);
};

const handleClose = () => {
    setShowRegister(false);
    setShowLogin(false);
    setShowForgotPassword(false);
    setShowAktivasiAkun(false);
};

const handleForgotPasswordClick = () => {
  setShowForgotPassword(true);
  setShowLogin(true); // This line makes sure Login pop-up is open when ForgotPassword is triggered
  setShowRegister(false);
  setShowAktivasiAkun(false);
};

  return (
    <div class={styles.homepage}>
      <header class={styles.header}>
        <div class={styles.logo}>
          <img src={logo} alt="Dashboard Monitor Logo" />
          <span class={styles.appname}>Monitor</span>
        </div>
        <nav class={styles.nav}>
          <ul>
            <li>
              <a href="#">Produk <img src={arrow} alt="Arrow Down" class={styles.arrow} /></a>
            </li>
            <li>
              <a href="#">Fitur <img src={arrow} alt="Arrow Down" class={styles.arrow} /></a>
            </li>
            <li>
              <a href="#">Keunggulan <img src={arrow} alt="Arrow Down" class={styles.arrow} /></a>
            </li>
            <li>
              <a href="#">Download <img src={arrow} alt="Arrow Down" class={styles.arrow} /></a>
            </li>
            <li>
              <a href="#">Kontak <img src={arrow} alt="Arrow Down" class={styles.arrow} /></a>
            </li>
          </ul>
        </nav>
        <div class={styles.actions}>
          <button class={styles.aktivasi} onClick={handleAktivasiClick}>Aktivasi akun</button>
          <div class={styles.pembatas}></div>
          <button class={styles.login} onClick={handleLoginClick}>Masuk</button>
          <button class={styles.register} onClick={handleRegisterClick}>Daftarkan akun</button>
          {showRegister() && <Register onClose={handleClose} onSwitch={handleLoginClick} />}
          {showAktivasiAkun() && <Aktivasi onClose={handleClose} onSwitch={handleLoginClick} />}
          {showLogin() && <Login onClose={handleClose} onSwitchToRegister={handleRegisterClick} onSwitchToPassword={handleForgotPasswordClick} />}
          {showForgotPassword() && <LupaPassword onClose={handleClose} onSwitch={handleLoginClick} />}
        </div>
      </header>
      <main class={styles.mainContent}>
        <h1 class={styles.judul}>Analisa, Pantau, Kelola</h1>
        <div class={styles.detail}>
          <div class={styles.kiri}>
            <img src={gambarPanah} alt="Gambar Panah" class={styles.gambarPanah}/>
          </div>
          <div class={styles.kanan}>
            <p class={styles.deskripsi1}>Kelola data akun anda dan analisis</p>
            <p class={styles.deskripsi2}>dengan bantuan grafik.</p>
            <div class={styles.button}>
              <button class={styles.mulaiSekarang} onClick={() => setShowLogin(true)}>Mulai sekarang</button>
              <button class={styles.jalankanDemo}>Download gratis</button>
            </div>
          </div>
        </div>
      </main>
      <div class={styles.illustration}>
        <img src={illustration} alt="Illustration" class={styles.gambar}/>
      </div>
    </div>
  );
};

export default Homepage;