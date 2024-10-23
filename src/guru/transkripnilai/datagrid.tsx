import { createSignal } from "solid-js";
import AgGridSolid from "ag-grid-solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import './datagrid.css';

// Tipe data untuk baris yang sedang diedit
interface RowData {
  no: number;
  namaPanjang: string;
  kkm: number;
  nilaiPengetahuan: number;
  nilaiKeterampilan: number;
}

const App = () => {
  // State untuk menyimpan data row dan mode edit
  const [rowData, setRowData] = createSignal<RowData[]>([
    { no: 1, namaPanjang: "Adhara Faliya Utanti", kkm: 75, nilaiPengetahuan: 98, nilaiKeterampilan: 99 },
    { no: 2, namaPanjang: "Auranisa Valent", kkm: 75, nilaiPengetahuan: 98, nilaiKeterampilan: 99 },
    { no: 3, namaPanjang: "Eridayalma Zahra Yohar", kkm: 75, nilaiPengetahuan: 98, nilaiKeterampilan: 99 },
    { no: 4, namaPanjang: "Pramusinta Ananta Fadzilah", kkm: 75, nilaiPengetahuan: 98, nilaiKeterampilan: 99 }
  ]);

  const [editMode, setEditMode] = createSignal<number | null>(null); // Baris yang sedang diedit
  const [editedData, setEditedData] = createSignal<Partial<RowData>>({}); // Data yang sedang diubah

  const columnDefs = [
    { headerName: "No", field: "no", width: 100 },
    { headerName: "Nama Panjang", field: "namaPanjang", flex: 1 },
    { headerName: "KKM", field: "kkm", width: 100, 
      cellRenderer: (params) => {
        return editMode() === params.data.no ? (
          <input
            type="number"
            value={editedData().kkm ?? params.data.kkm}
            onInput={(e) => handleInputChange('kkm', e.target.value)}
          />
        ) : (
          params.value
        );
      }
    },
    { headerName: "Nilai Pengetahuan", field: "nilaiPengetahuan", width: 150,
      cellRenderer: (params) => {
        return editMode() === params.data.no ? (
          <input
            type="number"
            value={editedData().nilaiPengetahuan ?? params.data.nilaiPengetahuan}
            onInput={(e) => handleInputChange('nilaiPengetahuan', e.target.value)}
          />
        ) : (
          params.value
        );
      }
    },
    { headerName: "Nilai Keterampilan", field: "nilaiKeterampilan", width: 150,
      cellRenderer: (params) => {
        return editMode() === params.data.no ? (
          <input
            type="number"
            value={editedData().nilaiKeterampilan ?? params.data.nilaiKeterampilan}
            onInput={(e) => handleInputChange('nilaiKeterampilan', e.target.value)}
          />
        ) : (
          params.value
        );
      }
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        return (
          <>
            {editMode() === params.data.no ? (
              <button class="save-btn" onClick={() => onSave(params.data.no)}>
                <div class="save-label">Simpan</div>
              </button>
            ) : (
              <button class="edit-btn" onClick={() => onEdit(params.data)}>
                <div class="edit-label">Edit</div>
              </button>
            )}
          </>
        );
      },
    },
  ];

  // Fungsi yang dijalankan saat tombol "Edit" diklik
  const onEdit = (row: RowData) => {
    setEditMode(row.no); // Aktifkan mode edit untuk baris ini
    setEditedData({ ...row }); // Copy data yang akan diubah
  };

  // Fungsi untuk menyimpan perubahan
  const onSave = (no: number) => {
    const updatedRows = rowData().map((row) =>
      row.no === no ? { ...row, ...editedData() } : row
    );
    setRowData(updatedRows); // Update data
    setEditMode(null); // Keluar dari mode edit
  };

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (field: keyof RowData, value: string) => {
    setEditedData({ ...editedData(), [field]: parseInt(value) });
  };

  return (
    <div class="ag-theme-alpine" style={{ height: "325px", width: "950px", "margin-left": "11px", "margin-top": "30px" }}>
      <AgGridSolid
        columnDefs={columnDefs}
        rowData={rowData()}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default App;