import { Component } from 'solid-js';
import { Routes, Route } from '@solidjs/router';
import Homepage from './homepage';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard'; // Make sure to import your dashboard component
import LupaPassword from './lupapassword';
import Aktivasi from './aktivasi';
import PetaLokasi from './petaLokasi';
import Navbar from './guru/navbar/navbar';
import Datasiswa from './guru/datasiswa/datasiswa';
import AbsensiList from './guru/datasiswa/absensilist';
import KelasDataSiswa from './guru/listdatasiswa/kelasdatasiswa';
import LihatDataSiswa from './guru/listdatasiswa/lihatdatasiswa';
import Transkrip from './guru/transkripnilai/transkripnilai';


const App: Component = () => {
  return (
    <Routes>
      <Route path="/" component={Homepage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/aktivasi" component={Aktivasi} />
      <Route path="/lupapassword" component={LupaPassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/petalokasi" component={PetaLokasi} />
      <Route path="/menuGuru" component={Navbar} />
      <Route path="/datasiswa" component={Datasiswa} />
      <Route path="/absensilist/:kelasName" component={AbsensiList} />
      <Route path="/kelasdatasiswa" component={KelasDataSiswa} />
      <Route path="/lihatdatasiswa/:kelasName" component={LihatDataSiswa} />
      <Route path="/transkrip" component={Transkrip} />
    </Routes>
  );
};

export default App;
