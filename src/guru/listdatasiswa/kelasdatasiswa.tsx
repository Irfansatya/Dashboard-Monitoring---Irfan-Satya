import { createSignal } from "solid-js";
import './kelasdatasiswa.css';

function DataKelas(props) {
  const [selectedClass, setSelectedClass] = createSignal("Kelas : X");

  const classes = ["Kelas : X", "Kelas : XI", "Kelas : XII"];

  const classesData = {
    "Kelas : X": [
      { name: "X MIPA 1", absensi: 32 },
      { name: "X MIPA 2", absensi: 28 },
      { name: "X MIPA 3", absensi: 28 },
      { name: "X IPS 1", absensi: 28 },
      { name: "X IPS 2", absensi: 28 },
    ],
    "Kelas : XI": [
      { name: "XI MIPA 1", absensi: 32 },
      { name: "XI MIPA 2", absensi: 28 },
      { name: "XI MIPA 3", absensi: 28 },
      { name: "XI IPS 1", absensi: 28 },
      { name: "XI IPS 2", absensi: 28 },
    ],
    "Kelas : XII": [
      { name: "XII MIPA 1", absensi: 32 },
      { name: "XII MIPA 2", absensi: 28 },
      { name: "XII MIPA 3", absensi: 28 },
      { name: "XII IPS 1", absensi: 28 },
      { name: "XII IPS 2", absensi: 28 },
    ],
  };

  const storedClassesData = localStorage.getItem("kelaslihatdata");
  const classCards = storedClassesData ? JSON.parse(storedClassesData) : classesData;

  const handleDetailClick = (kelasName) => {
    props.onDetailClick(kelasName);
  };

  return (
    <div class="daftarkelas">
      <div class="konten">
        <div class="header">
          <h1 class="judulDataSiswa">Daftar Kelas</h1>
          <select
            class="kelasDataSiswa"
            value={selectedClass()}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((cls) => (
              <option value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div class="cards-container">
          {classCards[selectedClass()].map((card) => (
            <div class="cardd">
              <div class="card-contentSiswa">
                <div class="text-contentSiswa">
                  <h2>{card.name}</h2>
                </div>
                <div class="icon-numberSiswa">
                  <img src="\src\asset2\user.svg" alt="Logo" class="iconnumber" />
                  <span class="number">{card.absensi}</span>
                </div>
              </div>
              <button class="cardButton" onClick={() => handleDetailClick(card.name)}>Cek detail</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DataKelas;
