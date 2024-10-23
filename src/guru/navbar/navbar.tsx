import { Component, createSignal } from 'solid-js';
import { useLocation } from '@solidjs/router';
import './navbar.css';
import Materi from '../pembelajaran/materi'
import Tugas from '../pembelajaran/tugas'
import Absensi from '../datasiswa/datasiswa'
import AbsensiList from '../datasiswa/absensilist'
import DataSiswa from '../listdatasiswa/kelasdatasiswa';
import ListSiswa from '../listdatasiswa/lihatdatasiswa';
import Transkrip from '../transkripnilai/transkripnilai';
import Aktivitas from '../aktivitas/aktivitas';
import absensi from '../assetGuru/absensi.svg';
import absensiHover from '../assetGuru/absensiHover.svg';
import appIcon from '../assetGuru/appIcon.svg';
import arrowuser from '../assetGuru/arrowuser.svg';
import datasiswa from '../assetGuru/datasiswa.svg';
import datasiswaHover from '../assetGuru/datasiswaHover.svg';
import editProfil from '../assetGuru/editProfil.svg';
import kalender from '../assetGuru/kalender.svg';
import keluarPopup from '../assetGuru/keluarPopup.svg';
import keluarSidebar from '../assetGuru/keluarSidebar.svg';
import notifikasi from '../assetGuru/notifikasi.svg';
import pembelajaran from '../assetGuru/pembelajaran.svg';
import pembelajaranHover from '../assetGuru/pembelajaranHover.svg';
import aktivitas from '../assetGuru/aktivitas.svg';
import aktivitasHover from '../assetGuru/aktivitasHover.svg';
import riwayat from '../assetGuru/riwayat.svg';
import searchSidebar from '../assetGuru/searchSidebar.svg';
import searchTopbar from '../assetGuru/searchTopbar.svg';
import tahunajar from '../assetGuru/tahunajar.svg';
import onlineStatus from '../assetGuru/onlineStatus.svg';
import transkrip from '../assetGuru/transkrip.svg';
import transkripHover from '../assetGuru/transkripHover.svg';

const Navbar: Component = () => {
    const [tahunajaran, setTahunajaran] = createSignal(localStorage.getItem('tahunajaran') || '2023/2024 - 2');
    const [activeMenu, setActiveMenu] = createSignal('pembelajaran');
    const [activeSubmenu, setActiveSubmenu] = createSignal('materi');
    const [showingDetailSiswa, setShowingDetailSiswa] = createSignal(false);
    const [selectedKelas, setSelectedKelas] = createSignal('');
    const [showingAbsensiDetail, setShowingAbsensiDetail] = createSignal(false);
    const location = useLocation();
  
    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
        setShowingDetailSiswa(false);
        setShowingAbsensiDetail(false);
        // Jangan reset submenu jika menu selain pembelajaran dipilih
    };
  
    const handleSubmenuClick = (submenu: string) => {
        setActiveSubmenu(submenu);
    };
  
    const updateTahunajaran = (value: string) => {
        setTahunajaran(value);
        localStorage.setItem('tahunajaran', value);
    };

    const handleDetailSiswaClick = (kelas: string) => {
        setSelectedKelas(kelas);
        setShowingDetailSiswa(true);
    };

    const handleAbsensiDetailClick = (kelas: string) => {
        setSelectedKelas(kelas);
        setShowingAbsensiDetail(true);
    };
  
    return (
      <div class="container">
          <div class="sidebar">
              <div class="title">
                  <img src={appIcon} alt="App Icon" class="webIcon" />
                  <h1 class="webName">Monitor</h1>
              </div>
              <div class="searchBar">
                  <img src={searchSidebar} alt="Search Sidebar" class="searchIcon" />
                  <input
                  type="text"
                  placeholder="Cari.."
                  class="searchText"
                  />
              </div>
              <div class="menu">
                  <div class="pembelajaran">
                      <div class={`menuSidebar ${activeMenu() === 'pembelajaran' ? 'menuActive' : ''}`} onClick={() => handleMenuClick('pembelajaran')}>
                          <img src={activeMenu() === 'pembelajaran' ? pembelajaranHover : pembelajaran} alt="Pembelajaran" class="menuIcon" />
                          <h2 class={activeMenu() === 'pembelajaran' ? 'menuTextHover' : 'menuText'}>Pembelajaran</h2>
                          {activeMenu() === 'pembelajaran' && <div class="penandaAktif"></div>}
                      </div>
                      {/* Tampilkan detailPembelajaran terlepas dari menu yang dipilih */}
                      <div class="detailPembelajaran">
                        <div class="garisPembelajaran">
                            <div class="garisVertikal"></div>
                            <div class="garisHorizontal1"></div>
                            <div class="garisHorizontal2"></div>
                        </div>
                        <div class="submenuPembelajaran">
                            <h2 class={activeMenu() === 'pembelajaran' ? (activeSubmenu() === 'materi' ? 'submenuHover' : 'submenu') : 'submenu'} onClick={() => handleSubmenuClick('materi')}># Materi</h2>
                            <h2 class={activeMenu() === 'pembelajaran' ? (activeSubmenu() === 'tugas' ? 'submenuHoverTugas' : 'submenuTugas') : 'submenuTugas'} onClick={() => handleSubmenuClick('tugas')}># Tugas</h2>
                        </div>
                    </div>
                  </div>
                  <div class={`menuSidebar ${activeMenu() === 'transkrip' ? 'menuActive' : ''}`} onClick={() => handleMenuClick('transkrip')}>
                      <img src={activeMenu() === 'transkrip' ? transkripHover : transkrip} alt="Transkrip" class="menuIcon" />
                      <h2 class={activeMenu() === 'transkrip' ? 'menuTextHover' : 'menuText'}>Transkrip Nilai</h2>
                      {activeMenu() === 'transkrip' && <div class="penandaAktif"></div>}
                  </div>
                  <div class={`menuSidebar ${activeMenu() === 'datasiswa' ? 'menuActive' : ''}`} onClick={() => handleMenuClick('datasiswa')}>
                      <img src={activeMenu() === 'datasiswa' ? datasiswaHover : datasiswa} alt="Data Siswa" class="menuIcon" />
                      <h2 class={activeMenu() === 'datasiswa' ? 'menuTextHover' : 'menuText'}>Data Siswa</h2>
                      {activeMenu() === 'datasiswa' && <div class="penandaAktif"></div>}
                  </div>
                  <div class={`menuSidebar ${activeMenu() === 'absensi' ? 'menuActive' : ''}`} onClick={() => handleMenuClick('absensi')}>
                      <img src={activeMenu() === 'absensi' ? absensiHover : absensi} alt="Absensi" class="menuIcon" />
                      <h2 class={activeMenu() === 'absensi' ? 'menuTextHover' : 'menuText'}>Absensi</h2>
                      {activeMenu() === 'absensi' && <div class="penandaAktif"></div>}
                  </div>
                  <h2 class="lainnya">Lainnya</h2>
                  <div class={`menuSidebar ${activeMenu() === 'aktivitas' ? 'menuActive' : ''}`} onClick={() => handleMenuClick('aktivitas')}>
                      <img src={activeMenu() === 'aktivitas' ? aktivitasHover : aktivitas} alt="Aktivitas Saya" class="menuIcon" />
                      <h2 class={activeMenu() === 'aktivitas' ? 'menuTextHover' : 'menuText'}>Aktivitas Saya</h2>
                      {activeMenu() === 'aktivitas' && <div class="penandaAktif"></div>}
                  </div>
                  <div class="menuSidebar">
                      <img src={keluarSidebar} alt="Keluar Sidebar" class="menuIcon" />
                      <h2 class="menuTextKeluar">Keluar</h2>
                  </div>
              </div>
          </div>
          <div class="topbar">
              <div class="tahunajar">
                  <img src={tahunajar} alt="Tahun Ajar" class="tahunajarIcon" />
                  <select class="tahunajarOpsi" value={tahunajaran()} onInput={(e) => updateTahunajaran(e.target.value)}>
                      <option value="1">2023/2024 - 2</option>
                      <option value="2">2023/2024 - 1</option>
                      <option value="3">2022/2023 - 2</option>
                      <option value="4">2022/2023 - 1</option>
                  </select>
              </div>
              <div class="kalender">
                  <img src={kalender} alt="Kalender" class="kalenderIcon" />
                  <h2 class="kalenderText">Kalender</h2>
              </div>
              <div class="buttonTopbar">
                  <img src={notifikasi} alt="Notifikasi Topbar" class="notifikasiTopbar" />
              </div>
              <div class="buttonTopbar">
                  <img src={searchTopbar} alt="Search Topbar" class="searchTopbar" />
              </div>
              <div class="avatarUser">
                  <h1 class="inisial">I</h1>
              </div>
              <div class="detailUser">
                  <div class="namaDanMapel">
                      <h2 class="namaUser">Irfan Satya</h2>
                      <h2 class="mapelUser">IPA</h2>
                  </div>
                  <h2 class="emailUser">irfansatya75@gmail.com</h2>
              </div>
              <div class="arrowContainer">
                <img
                  src={arrowuser}
                  alt="Icon Arrow"
                  class="arrowUser"
                />
              </div>
          </div>
          <div class="content">
            {/* Tampilkan materi atau tugas hanya jika menu pembelajaran aktif */}
            {activeMenu() === 'pembelajaran' && activeSubmenu() === 'materi' && <Materi />}
            {activeMenu() === 'pembelajaran' && activeSubmenu() === 'tugas' && <Tugas />}
            {activeMenu() === 'transkrip' && <Transkrip />}
            {activeMenu() === 'datasiswa' && !showingDetailSiswa() && <DataSiswa onDetailClick={handleDetailSiswaClick} />}
            {activeMenu() === 'datasiswa' && showingDetailSiswa() && <ListSiswa kelasName={selectedKelas()} onBack={() => setShowingDetailSiswa(false)} />}
            {activeMenu() === 'absensi' && !showingAbsensiDetail() && <Absensi onDetailClick={handleAbsensiDetailClick} />}
            {activeMenu() === 'absensi' && showingAbsensiDetail() && <AbsensiList kelasName={selectedKelas()} onBack={() => setShowingAbsensiDetail(false)} />}
            {activeMenu() === 'aktivitas' && <Aktivitas />}
          </div>
      </div>
    );
  };
  
  export default Navbar;  