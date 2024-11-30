import { Component } from 'solid-js';
import { Routes, Route } from '@solidjs/router';
import Homepage from './homepage';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import LupaPassword from './lupapassword';
import Aktivasi from './aktivasi';
import PetaLokasi from './petaLokasi';

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
    </Routes>
  );
};

export default App;
