// src/pages/AktivitasGuru.tsx
import { createSignal, For } from "solid-js";
import ChartWaktuKerja from "./chartaktivitas";
import "./aktivitas.css";

const AktivitasGuru = () => {
  const [aktivitas, setAktivitas] = createSignal([
    { id: 1, nama: "Transkrip nilai biologi kelas XI MIPA 2", tanggal: "Jumat, 3 Januari 2025", hari: "Hari ini" },
    { id: 2, nama: "Transkrip nilai biologi kelas XI MIPA 2", tanggal: "Jumat, 3 Januari 2025", hari: "Hari ini" },
    { id: 3, nama: "Transkrip nilai biologi kelas XI MIPA 2", tanggal: "Jumat, 3 Januari 2025", hari: "Kemarin" },
    { id: 4, nama: "Transkrip nilai biologi kelas XI MIPA 2", tanggal: "Jumat, 3 Januari 2025", hari: "Kemarin" },
    { id: 5, nama: "Transkrip nilai biologi kelas XI MIPA 2", tanggal: "Jumat, 3 Januari 2025", hari: "Kemarin" },
  ]);

  const hapusAktivitas = (id: number) => {
    setAktivitas((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div class="aktivitas-guru">
      <div class="chart-aktivitas">{<ChartWaktuKerja />}</div>
      <div class="aktivitas-konten">
        <h3>Aktivitas terakhir</h3>
        <h4>Hari ini</h4>
        <For each={aktivitas().filter((item) => item.hari === "Hari ini")}>
          {(item) => (
            <div class="aktivitas-item">
              <div>
                <h3>{item.nama}</h3>
                <p>{item.tanggal}</p>
              </div>
              <button onClick={() => hapusAktivitas(item.id)}>Hapus</button>
            </div>
          )}
        </For>

        <h4>Kemarin</h4>
        <For each={aktivitas().filter((item) => item.hari === "Kemarin")}>
          {(item) => (
            <div class="aktivitas-item">
              <div>
                <h3>{item.nama}</h3>
                <p>{item.tanggal}</p>
              </div>
              <button onClick={() => hapusAktivitas(item.id)}>Hapus</button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default AktivitasGuru;
