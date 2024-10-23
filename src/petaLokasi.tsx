import { onMount, onCleanup, createSignal } from "solid-js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from './petaLokasi.module.css';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function PetaLokasi() {
  let mapContainer: HTMLDivElement | undefined;
  let searchInput: HTMLInputElement | undefined;
  let searchResults: HTMLDivElement | undefined;
  let map: L.Map | undefined;
  let jawaData: any = null;
  let pendudukJawa: any = null;
  let jawaBaratData: any = null;
  let pendudukJawabarat: any = null;
  let diyData: any = null;
  let pendudukDIY: any = null;
  let jawatimurData: any = null;
  let pendudukJawatimur: any = null;
  let jawatengahData: any = null;
  let pendudukJawatengah: any = null;
  let dkijakartaData: any = null;
  let pendudukDkijakarta: any = null;
  let bantenData: any = null;
  let pendudukBanten: any = null;

  const [searchTerm, setSearchTerm] = createSignal('');
  const [filteredLocations, setFilteredLocations] = createSignal<any[]>([]);
  const [selectedMarker, setSelectedMarker] = createSignal<L.Marker | null>(null);

  const hereTileUrl = 'https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=L8yobW4cRif-9pdOKs06ETewaVHHT7XHYWt3oh4p2ZY&lg=eng';

  const markersData = [
    {
      pulau: "Jawa",
      lat: -7.6145, lng: 110.7122, luas: "128.297 km²",
      provinsi: [
        {
          name: "DKI Jakarta",
          lat: -6.2088, lng: 106.8456, luas: "662 km²",
          kabupaten: [
            {
              name: "Jakarta Pusat",
              lat: -6.1991, lng: 106.8323, luas: "48 km²",
              kecamatan: [
                { name: "Menteng", lat: -6.1991, lng: 106.8323, luas: "7.23 km²" },
                { name: "Gambir", lat: -6.1754, lng: 106.8272, luas: "7.59 km²" },
                { name: "Tanah Abang", lat: -6.2021, lng: 106.8184, luas: "9.30 km²" },
                { name: "Senen", lat: -6.1951, lng: 106.8390, luas: "4.91 km²" },
                { name: "Cempaka Putih", lat: -6.2035, lng: 106.8592, luas: "3.79 km²" }
              ]
            },
            {
              name: "Jakarta Utara",
              lat: -6.1361, lng: 106.8505, luas: "137.12 km²",
              kecamatan: [
                { name: "Kelapa Gading", lat: -6.1387, lng: 106.8884, luas: "11.49 km²" },
                { name: "Tanjung Priok", lat: -6.1336, lng: 106.8557, luas: "17.44 km²" },
                { name: "Cilincing", lat: -6.1451, lng: 106.8958, luas: "37.84 km²" },
                { name: "Koja", lat: -6.1425, lng: 106.8772, luas: "15.25 km²" },
                { name: "Penjaringan", lat: -6.1446, lng: 106.8088, luas: "33.10 km²" }
              ]
            },
            {
              name: "Jakarta Barat",
              lat: -6.1750, lng: 106.8650, luas: "124.44 km²",
              kecamatan: [
                { name: "Grogol Petamburan", lat: -6.1731, lng: 106.7850, luas: "11.22 km²" },
                { name: "Taman Sari", lat: -6.1482, lng: 106.8205, luas: "6.92 km²" },
                { name: "Palmerah", lat: -6.1846, lng: 106.7956, luas: "6.10 km²" },
                { name: "Kebon Jeruk", lat: -6.1977, lng: 106.7940, luas: "11.95 km²" },
                { name: "Cengkareng", lat: -6.1538, lng: 106.7263, luas: "25.58 km²" }
              ]
            },
            {
              name: "Jakarta Selatan",
              lat: -6.2916, lng: 106.8045, luas: "141.27 km²",
              kecamatan: [
                { name: "Kebayoran Baru", lat: -6.2411, lng: 106.7956, luas: "14.95 km²" },
                { name: "Pasar Minggu", lat: -6.2847, lng: 106.8271, luas: "25.07 km²" },
                { name: "Tebet", lat: -6.2574, lng: 106.8505, luas: "9.48 km²" },
                { name: "Setiabudi", lat: -6.2151, lng: 106.8271, luas: "8.75 km²" },
                { name: "Mampang Prapatan", lat: -6.2380, lng: 106.8448, luas: "8.77 km²" }
              ]
            },
            {
              name: "Jakarta Timur",
              lat: -6.2304, lng: 106.8493, luas: "188.03 km²",
              kecamatan: [
                { name: "Matraman", lat: -6.2167, lng: 106.8556, luas: "7.36 km²" },
                { name: "Pulo Gadung", lat: -6.1881, lng: 106.8963, luas: "24.04 km²" },
                { name: "Cakung", lat: -6.2132, lng: 106.9045, luas: "42.67 km²" },
                { name: "Duren Sawit", lat: -6.2131, lng: 106.8822, luas: "39.09 km²" },
                { name: "Jatinegara", lat: -6.2222, lng: 106.8694, luas: "10.72 km²" }
              ]
            }
          ]
        },
        {
          name: "Jawa Barat",
          lat: -6.9147, lng: 107.6098, luas: "35,378 km²",
          kabupaten: [
            {
              name: "Bandung",
              lat: -6.9175, lng: 107.6191, luas: "167 km²",
              kecamatan: [
                { name: "Bandung Wetan", lat: -6.9146, lng: 107.6100, luas: "2.6 km²" },
                { name: "Bandung Kulon", lat: -6.9225, lng: 107.6053, luas: "3.0 km²" },
                { name: "Bandung Kidul", lat: -6.9212, lng: 107.6090, luas: "4.2 km²" },
                { name: "Bandung Barat", lat: -6.9057, lng: 107.6174, luas: "5.5 km²" },
                { name: "Cibeunying", lat: -6.9030, lng: 107.6167, luas: "6.3 km²" }
              ]
            },
            {
              name: "Bogor",
              lat: -6.5988, lng: 106.7971, luas: "118.5 km²",
              kecamatan: [
                { name: "Bogor Tengah", lat: -6.5963, lng: 106.7954, luas: "5.6 km²" },
                { name: "Bogor Selatan", lat: -6.5930, lng: 106.7968, luas: "9.8 km²" },
                { name: "Bogor Utara", lat: -6.6015, lng: 106.7974, luas: "7.2 km²" },
                { name: "Bogor Timur", lat: -6.6056, lng: 106.8004, luas: "8.3 km²" },
                { name: "Bogor Barat", lat: -6.6096, lng: 106.7909, luas: "9.7 km²" }
              ]
            },
            {
              name: "Bekasi",
              lat: -6.2348, lng: 107.0126, luas: "210.5 km²",
              kecamatan: [
                { name: "Bekasi Timur", lat: -6.2298, lng: 107.0156, luas: "9.4 km²" },
                { name: "Bekasi Barat", lat: -6.2263, lng: 107.0138, luas: "10.5 km²" },
                { name: "Bekasi Selatan", lat: -6.2381, lng: 107.0174, luas: "12.0 km²" },
                { name: "Bekasi Utara", lat: -6.2371, lng: 107.0123, luas: "15.6 km²" },
                { name: "Medan Satria", lat: -6.2421, lng: 107.0099, luas: "7.8 km²" }
              ]
            },
            {
              name: "Depok",
              lat: -6.5911, lng: 106.7882, luas: "200.3 km²",
              kecamatan: [
                { name: "Depok I", lat: -6.5936, lng: 106.7964, luas: "6.2 km²" },
                { name: "Depok II", lat: -6.5907, lng: 106.7982, luas: "7.1 km²" },
                { name: "Depok III", lat: -6.5886, lng: 106.7944, luas: "8.5 km²" },
                { name: "Depok IV", lat: -6.5917, lng: 106.7916, luas: "9.3 km²" },
                { name: "Depok V", lat: -6.5931, lng: 106.7905, luas: "4.9 km²" }
              ]
            },
            {
              name: "Cirebon",
              lat: -6.7321, lng: 108.5480, luas: "37.36 km²",
              kecamatan: [
                { name: "Cirebon Barat", lat: -6.7342, lng: 108.5463, luas: "6.7 km²" },
                { name: "Cirebon Timur", lat: -6.7401, lng: 108.5502, luas: "7.3 km²" },
                { name: "Cirebon Selatan", lat: -6.7338, lng: 108.5409, luas: "8.2 km²" },
                { name: "Cirebon Utara", lat: -6.7254, lng: 108.5587, luas: "9.1 km²" },
                { name: "Pangeran", lat: -6.7309, lng: 108.5489, luas: "4.8 km²" }
              ]
            }
          ]
        },
        {
          name: "Banten",
          lat: -6.1200, lng: 106.0922, luas: "9,160 km²",
          kabupaten: [
            {
              name: "Serang",
              lat: -6.1147, lng: 106.1580, luas: "1,467.35 km²",
              kecamatan: [
                { name: "Serang Kota", lat: -6.1136, lng: 106.1602, luas: "10.5 km²" },
                { name: "Kasemen", lat: -6.1176, lng: 106.1621, luas: "15.4 km²" },
                { name: "Cipocok Jaya", lat: -6.1141, lng: 106.1560, luas: "18.3 km²" },
                { name: "Taktakan", lat: -6.1171, lng: 106.1514, luas: "21.5 km²" },
                { name: "Serang Barat", lat: -6.1168, lng: 106.1558, luas: "14.2 km²" }
              ]
            },
            {
              name: "Tangerang",
              lat: -6.2033, lng: 106.6338, luas: "1,011.16 km²",
              kecamatan: [
                { name: "Tangerang Kota", lat: -6.2045, lng: 106.6337, luas: "19.5 km²" },
                { name: "Ciledug", lat: -6.2200, lng: 106.6255, luas: "18.2 km²" },
                { name: "Ciputat", lat: -6.2970, lng: 106.7632, luas: "20.5 km²" },
                { name: "Tangerang Selatan", lat: -6.2968, lng: 106.7855, luas: "23.1 km²" },
                { name: "Batu Ceper", lat: -6.1950, lng: 106.6270, luas: "17.6 km²" }
              ]
            },
            {
              name: "Cilegon",
              lat: -6.0196, lng: 106.0257, luas: "175.5 km²",
              kecamatan: [
                { name: "Cilegon Timur", lat: -6.0251, lng: 106.0224, luas: "24.3 km²" },
                { name: "Cilegon Barat", lat: -6.0218, lng: 106.0321, luas: "22.1 km²" },
                { name: "Cilegon Selatan", lat: -6.0164, lng: 106.0240, luas: "18.5 km²" },
                { name: "Cilegon Utara", lat: -6.0181, lng: 106.0270, luas: "19.4 km²" },
                { name: "Krakatau", lat: -6.0134, lng: 106.0282, luas: "25.2 km²" }
              ]
            },
            {
              name: "Pandeglang",
              lat: -6.3111, lng: 106.1032, luas: "2,740.55 km²",
              kecamatan: [
                { name: "Pandeglang Kota", lat: -6.3098, lng: 106.1030, luas: "9.6 km²" },
                { name: "Labuan", lat: -6.2914, lng: 106.1025, luas: "12.3 km²" },
                { name: "Cadasari", lat: -6.2946, lng: 106.1054, luas: "13.1 km²" },
                { name: "Panimbang", lat: -6.3054, lng: 106.1137, luas: "14.5 km²" },
                { name: "Menes", lat: -6.3017, lng: 106.0969, luas: "10.7 km²" }
              ]
            },
            {
              name: "Lebak",
              lat: -6.6266, lng: 106.1371, luas: "3,305.52 km²",
              kecamatan: [
                { name: "Lebak Kota", lat: -6.6192, lng: 106.1348, luas: "11.5 km²" },
                { name: "Rangkasbitung", lat: -6.6294, lng: 106.1379, luas: "12.1 km²" },
                { name: "Cibadak", lat: -6.6366, lng: 106.1322, luas: "15.4 km²" },
                { name: "Malingping", lat: -6.6460, lng: 106.1410, luas: "14.3 km²" },
                { name: "Panggarangan", lat: -6.6297, lng: 106.1526, luas: "16.7 km²" }
              ]
            }
          ]
        },
        {
          name: "Jawa Tengah",
          lat: -7.0078, lng: 110.4244, luas: "32,548 km²",
          kabupaten: [
            {
              name: "Semarang",
              lat: -6.9660, lng: 110.4156, luas: "373 km²",
              kecamatan: [
                { name: "Semarang Selatan", lat: -6.9660, lng: 110.4156, luas: "15 km²" },
                { name: "Semarang Utara", lat: -6.9760, lng: 110.4170, luas: "18 km²" },
                { name: "Semarang Barat", lat: -6.9671, lng: 110.4071, luas: "20 km²" },
                { name: "Semarang Timur", lat: -6.9700, lng: 110.4200, luas: "22 km²" },
                { name: "Semarang Tengah", lat: -6.9686, lng: 110.4185, luas: "19 km²" }
              ]
            },
            {
              name: "Solo",
              lat: -7.5664, lng: 110.8238, luas: "44.04 km²",
              kecamatan: [
                { name: "Solo Kota", lat: -7.5667, lng: 110.8233, luas: "11.2 km²" },
                { name: "Jebres", lat: -7.5662, lng: 110.8258, luas: "9.8 km²" },
                { name: "Laweyan", lat: -7.5587, lng: 110.8254, luas: "10 km²" },
                { name: "Banjarsari", lat: -7.5589, lng: 110.8210, luas: "8.2 km²" },
                { name: "Pasar Kliwon", lat: -7.5663, lng: 110.8266, luas: "5.8 km²" }
              ]
            },
            {
              name: "Magelang",
              lat: -7.4687, lng: 110.2200, luas: "18.12 km²",
              kecamatan: [
                { name: "Magelang Selatan", lat: -7.4736, lng: 110.2189, luas: "4.3 km²" },
                { name: "Magelang Utara", lat: -7.4575, lng: 110.2224, luas: "4.9 km²" },
                { name: "Magelang Barat", lat: -7.4683, lng: 110.2241, luas: "4.7 km²" },
                { name: "Magelang Timur", lat: -7.4692, lng: 110.2208, luas: "4.8 km²" },
                { name: "Magelang Tengah", lat: -7.4678, lng: 110.2226, luas: "4.3 km²" }
              ]
            },
            {
              name: "Salatiga",
              lat: -7.3358, lng: 110.5148, luas: "17.87 km²",
              kecamatan: [
                { name: "Salatiga Kota", lat: -7.3344, lng: 110.5185, luas: "4.2 km²" },
                { name: "Argomulyo", lat: -7.3404, lng: 110.5155, luas: "5 km²" },
                { name: "Sidorejo", lat: -7.3364, lng: 110.5184, luas: "4.3 km²" },
                { name: "Tingkir", lat: -7.3367, lng: 110.5166, luas: "4.37 km²" },
                { name: "Kota Salatiga", lat: -7.3360, lng: 110.5159, luas: "4.12 km²" }
              ]
            },
            {
              name: "Banyumas",
              lat: -7.3667, lng: 109.2249, luas: "1,335.3 km²",
              kecamatan: [
                { name: "Purwokerto Barat", lat: -7.3706, lng: 109.2294, luas: "22.2 km²" },
                { name: "Purwokerto Timur", lat: -7.3621, lng: 109.2337, luas: "20.4 km²" },
                { name: "Purwokerto Selatan", lat: -7.3674, lng: 109.2224, luas: "21.5 km²" },
                { name: "Purwokerto Utara", lat: -7.3683, lng: 109.2164, luas: "22 km²" },
                { name: "Kebasen", lat: -7.3682, lng: 109.2274, luas: "18.6 km²" }
              ]
            }
          ]
        },
        {
          name: "DI Yogyakarta",
          lat: -7.7956, lng: 110.3695, luas: "3.185 km²",
          kabupaten: [
            {
              name: "Yogyakarta",
              lat: -7.7956, lng: 110.3695, luas: "32.5 km²",
              kecamatan: [
                { name: "Danurejan", lat: -7.7939, lng: 110.3666, luas: "2.32 km²" },
                { name: "Gedongtengen", lat: -7.7941, lng: 110.3737, luas: "2.60 km²" },
                { name: "Kraton", lat: -7.7986, lng: 110.3651, luas: "3.90 km²" },
                { name: "Mergangsan", lat: -7.7956, lng: 110.3701, luas: "3.52 km²" },
                { name: "Umbulharjo", lat: -7.7984, lng: 110.3712, luas: "4.23 km²" }
              ]
            },
            {
              name: "Bantul",
              lat: -7.9496, lng: 110.3203, luas: "508 km²",
              kecamatan: [
                { name: "Bantul Kota", lat: -7.9467, lng: 110.3199, luas: "32 km²" },
                { name: "Kasihan", lat: -7.9465, lng: 110.3190, luas: "28 km²" },
                { name: "Piyungan", lat: -7.9492, lng: 110.3156, luas: "36 km²" },
                { name: "Sanden", lat: -7.9553, lng: 110.3109, luas: "45 km²" },
                { name: "Sedayu", lat: -7.9488, lng: 110.3220, luas: "50 km²" }
              ]
            },
            {
              name: "Sleman",
              lat: -7.7434, lng: 110.3771, luas: "574 km²",
              kecamatan: [
                { name: "Sleman", lat: -7.7436, lng: 110.3774, luas: "32 km²" },
                { name: "Ngemplak", lat: -7.7482, lng: 110.3700, luas: "42 km²" },
                { name: "Mlati", lat: -7.7421, lng: 110.3714, luas: "46 km²" },
                { name: "Gamping", lat: -7.7471, lng: 110.3738, luas: "36 km²" },
                { name: "Caturtunggal", lat: -7.7426, lng: 110.3791, luas: "28 km²" }
              ]
            },
            {
              name: "Gunung Kidul",
              lat: -8.0186, lng: 110.5753, luas: "1.485 km²",
              kecamatan: [
                { name: "Wonosari", lat: -8.0131, lng: 110.5732, luas: "72 km²" },
                { name: "Saptosari", lat: -8.0184, lng: 110.5762, luas: "48 km²" },
                { name: "Paliyan", lat: -8.0221, lng: 110.5778, luas: "65 km²" },
                { name: "Panggang", lat: -8.0200, lng: 110.5730, luas: "80 km²" },
                { name: "Karangmojo", lat: -8.0202, lng: 110.5717, luas: "90 km²" }
              ]
            },
            {
              name: "Kulon Progo",
              lat: -7.8020, lng: 110.2671, luas: "586 km²",
              kecamatan: [
                { name: "Wates", lat: -7.8039, lng: 110.2701, luas: "36 km²" },
                { name: "Kokap", lat: -7.8017, lng: 110.2679, luas: "45 km²" },
                { name: "Pengasih", lat: -7.8003, lng: 110.2654, luas: "52 km²" },
                { name: "Kalibawang", lat: -7.8022, lng: 110.2680, luas: "48 km²" },
                { name: "Lendah", lat: -7.8045, lng: 110.2711, luas: "42 km²" }
              ]
            }
          ]
        },
        {
          name: "Jawa Timur",
          lat: -7.2754, lng: 112.6410, luas: "47.799 km²",
          kabupaten: [
            {
              name: "Surabaya",
              lat: -7.2504, lng: 112.7688, luas: "350.54 km²",
              kecamatan: [
                { name: "Pabean Cantikan", lat: -7.2453, lng: 112.7676, luas: "8.12 km²" },
                { name: "Gubeng", lat: -7.2568, lng: 112.7883, luas: "7.65 km²" },
                { name: "Tegalsari", lat: -7.2587, lng: 112.7591, luas: "6.93 km²" },
                { name: "Wonokromo", lat: -7.2597, lng: 112.7707, luas: "9.10 km²" },
                { name: "Rungkut", lat: -7.2733, lng: 112.7654, luas: "10.32 km²" }
              ]
            },
            {
              name: "Malang",
              lat: -7.9668, lng: 112.6326, luas: "252.06 km²",
              kecamatan: [
                { name: "Malang Kota", lat: -7.9668, lng: 112.6326, luas: "15.00 km²" },
                { name: "Klojen", lat: -7.9655, lng: 112.6265, luas: "10.29 km²" },
                { name: "Lowokwaru", lat: -7.9555, lng: 112.6320, luas: "17.13 km²" },
                { name: "Sukun", lat: -7.9695, lng: 112.6255, luas: "12.45 km²" },
                { name: "Blimbing", lat: -7.9655, lng: 112.6225, luas: "11.20 km²" }
              ]
            },
            {
              name: "Kediri",
              lat: -7.8057, lng: 112.0150, luas: "634.40 km²",
              kecamatan: [
                { name: "Kediri Kota", lat: -7.7988, lng: 112.0140, luas: "27.40 km²" },
                { name: "Mojo", lat: -7.8095, lng: 112.0155, luas: "35.60 km²" },
                { name: "Grogol", lat: -7.8091, lng: 112.0170, luas: "30.40 km²" },
                { name: "Pagu", lat: -7.8083, lng: 112.0137, luas: "25.80 km²" },
                { name: "Kandat", lat: -7.8121, lng: 112.0183, luas: "28.30 km²" }
              ]
            },
            {
              name: "Jember",
              lat: -8.1721, lng: 113.7111, luas: "3.293,34 km²",
              kecamatan: [
                { name: "Jember Kota", lat: -8.1747, lng: 113.7114, luas: "20.30 km²" },
                { name: "Arjasa", lat: -8.1655, lng: 113.7242, luas: "35.60 km²" },
                { name: "Jenggawah", lat: -8.1735, lng: 113.7333, luas: "50.70 km²" },
                { name: "Ambulu", lat: -8.1700, lng: 113.7060, luas: "35.50 km²" },
                { name: "Sukorambi", lat: -8.1745, lng: 113.7056, luas: "30.90 km²" }
              ]
            },
            {
              name: "Banyuwangi",
              lat: -8.2168, lng: 114.4234, luas: "5.782,50 km²",
              kecamatan: [
                { name: "Banyuwangi Kota", lat: -8.2165, lng: 114.4230, luas: "25.30 km²" },
                { name: "Giri", lat: -8.2135, lng: 114.4255, luas: "30.70 km²" },
                { name: "Glagah", lat: -8.2120, lng: 114.4190, luas: "40.30 km²" },
                { name: "Sukamade", lat: -8.2212, lng: 114.4276, luas: "60.20 km²" },
                { name: "Kalon", lat: -8.2200, lng: 114.4187, luas: "35.50 km²" }
              ]
            }
          ]
        }
      ]
    },
    {
      pulau: "Sumatra",
      lat: -0.5610, lng: 101.8313, luas: "473.481 km²",
      provinsi: [
        {
          kabupaten: [
            {
              kecamatan: [
              ]
            }
          ]
        }
      ]
    },
    {
      pulau: "Kalimantan",
      lat: 0.7893, lng: 114.9911, luas: "743.330 km²",
      provinsi: [
        {
          kabupaten: [
            {
              kecamatan: [
              ]
            }
          ]
        }
      ]
    },
    {
      pulau: "Sulawesi",
      lat: -1.2017, lng: 120.5515, luas: "189.216 km²",
      provinsi: [
        {
          kabupaten: [
            {
              kecamatan: [
              ]
            }
          ]
        }
      ]
    },
    {
      pulau: "Bali",
      lat: -8.4095, lng: 115.1889, luas: "5.780 km²",
      provinsi: [
        {
          kabupaten: [
            {
              kecamatan: [
              ]
            }
          ]
        }
      ]
    },
    {
      pulau: "Papua",
      lat: -4.4419, lng: 136.1504, luas: "319.036 km²",
      provinsi: [
        {
          kabupaten: [
            {
              kecamatan: [
              ]
            }
          ]
        }
      ]
    }
  ];

  let pulauLayer = L.layerGroup();
  let provinsiLayer = L.layerGroup();
  let kabupatenLayer = L.layerGroup();
  let kecamatanLayer = L.layerGroup();

  // Function to search locations by name (Pulau, Provinsi, Kabupaten, or Kecamatan)
  function searchLocation(query: string) {
    const results = [];

    markersData.forEach(pulau => {
        if (pulau.pulau && pulau.pulau.toLowerCase().includes(query.toLowerCase())) {
            results.push({ name: pulau.pulau, lat: pulau.lat, lng: pulau.lng, type: 'Pulau' });
        }
        if (pulau.provinsi) {
            pulau.provinsi.forEach(provinsi => {
                if (provinsi.name && provinsi.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({ name: provinsi.name, lat: provinsi.lat, lng: provinsi.lng, type: 'Provinsi' });
                }
                if (provinsi.kabupaten) {
                    provinsi.kabupaten.forEach(kabupaten => {
                        if (kabupaten.name && kabupaten.name.toLowerCase().includes(query.toLowerCase())) {
                            results.push({ name: kabupaten.name, lat: kabupaten.lat, lng: kabupaten.lng, type: 'Kabupaten' });
                        }
                        if (kabupaten.kecamatan) {
                            kabupaten.kecamatan.forEach(kecamatan => {
                                if (kecamatan.name && kecamatan.name.toLowerCase().includes(query.toLowerCase())) {
                                    results.push({ name: kecamatan.name, lat: kecamatan.lat, lng: kecamatan.lng, type: 'Kecamatan' });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    setFilteredLocations(results);

    // Automatically zoom to the first result and show the popup
    if (results.length > 0) {
      const firstResult = results[0];
      zoomToLocation(firstResult.lat, firstResult.lng, firstResult.type);
    }
}

function handleSearchInput(e: InputEvent) {
  const query = (e.target as HTMLInputElement).value;
  console.log("Search query:", query); // Debugging line
  setSearchTerm(query);
  searchLocation(query);
}

function zoomToLocation(lat: number, lng: number, type: string) {
  map!.setView([lat, lng], getZoomLevelForType(type));
  setFilteredLocations([]); // Clear the autocomplete list after selection
}

function getZoomLevelForType(type: string): number {
  switch (type) {
    case 'Pulau': return 7;
    case 'Provinsi': return 8;
    case 'Kabupaten': return 11;
    case 'Kecamatan': return 15;
    default: return 5;
  }
}

  onMount(async () => {
    map = L.map(mapContainer!).setView([-2.5489, 118.0149], 5);
    L.tileLayer(hereTileUrl, { maxZoom: 18 }).addTo(map);

    const jawaResponse = await fetch("http://127.0.0.1:8080/users/gender_jawa");
    if (jawaResponse.ok) {
      jawaData = await jawaResponse.json();
    } else {
      console.error("Failed to fetch gender data for Jawa Island");
    }

    const pendudukJawaResponse = await fetch("http://127.0.0.1:8080/users/penduduk_jawa");
    if (pendudukJawaResponse.ok) {
      pendudukJawa = await pendudukJawaResponse.json();
    } else {
      console.error("Failed to fetch population data for Jawa Island");
    }

    // Fetch Jawa Barat gender data from backend
    const jawaBaratResponse = await fetch("http://127.0.0.1:8080/users/gender_jawabarat");
    if (jawaBaratResponse.ok) {
      jawaBaratData = await jawaBaratResponse.json();
    } else {
      console.error("Failed to fetch gender data for Jawa Barat");
    }

    const pendudukJawaBaratResponse = await fetch("http://127.0.0.1:8080/users/penduduk_jawabarat");
    if (pendudukJawaBaratResponse.ok) {
      pendudukJawabarat = await pendudukJawaBaratResponse.json();
    } else {
      console.error("Failed to fetch population data for Jawa Barat");
    }

    // Fetch DI Yogyakarta gender data from backend
    const diyGenderResponse = await fetch("http://127.0.0.1:8080/users/gender_diyogyakarta");
    if (diyGenderResponse.ok) {
      diyData = await diyGenderResponse.json();
    } else {
      console.error("Failed to fetch gender data for DI Yogyakarta");
    }

    const pendudukDIYResponse = await fetch("http://127.0.0.1:8080/users/penduduk_diyogyakarta");
    if (pendudukDIYResponse.ok) {
      pendudukDIY = await pendudukDIYResponse.json();
    } else {
      console.error("Failed to fetch population data for DI Yogyakarta");
    }

    const jawaTimurResponse = await fetch("http://127.0.0.1:8080/users/gender_jawatimur");
    if (jawaTimurResponse.ok) {
      jawatimurData = await jawaTimurResponse.json();
    } else {
      console.error("Failed to fetch gender data for Jawa Timur");
    }

    const pendudukJawaTimurResponse = await fetch("http://127.0.0.1:8080/users/penduduk_jawatimur");
    if (pendudukJawaTimurResponse.ok) {
      pendudukJawatimur = await pendudukJawaTimurResponse.json();
    } else {
      console.error("Failed to fetch population data for Jawa Timur");
    }

    const jawaTengahResponse = await fetch("http://127.0.0.1:8080/users/gender_jawatengah");
    if (jawaTengahResponse.ok) {
      jawatengahData = await jawaTengahResponse.json();
    } else {
      console.error("Failed to fetch gender data for Jawa Tengah");
    }

    const pendudukJawaTengahResponse = await fetch("http://127.0.0.1:8080/users/penduduk_jawatengah");
    if (pendudukJawaTengahResponse.ok) {
      pendudukJawatengah = await pendudukJawaTengahResponse.json();
    } else {
      console.error("Failed to fetch population data for Jawa Tengah");
    }

    const dkiJakartaResponse = await fetch("http://127.0.0.1:8080/users/gender_dkijakarta");
    if (dkiJakartaResponse.ok) {
      dkijakartaData = await dkiJakartaResponse.json();
    } else {
      console.error("Failed to fetch gender data for DKI Jakarta");
    }

    const pendudukDkiJakartaResponse = await fetch("http://127.0.0.1:8080/users/penduduk_dkijakarta");
    if (pendudukDkiJakartaResponse.ok) {
      pendudukDkijakarta = await pendudukDkiJakartaResponse.json();
    } else {
      console.error("Failed to fetch population data for DKI Jakarta");
    }

    const bantenResponse = await fetch("http://127.0.0.1:8080/users/gender_banten");
    if (bantenResponse.ok) {
      bantenData = await bantenResponse.json();
    } else {
      console.error("Failed to fetch gender data for Banten");
    }

    const pendudukBantenResponse = await fetch("http://127.0.0.1:8080/users/penduduk_banten");
    if (pendudukBantenResponse.ok) {
      pendudukBanten = await pendudukBantenResponse.json();
    } else {
      console.error("Failed to fetch population data for Banten");
    }

    function addPulauMarkers() {
      markersData.forEach((pulau) => {
        const popupContent = `
          <b>Nama Pulau:</b> ${pulau.pulau}<br>
          <b>Latitude:</b> ${pulau.lat}<br>
          <b>Longitude:</b> ${pulau.lng}<br>
          <b>Luas Wilayah:</b> ${pulau.luas}<br>
          ${pulau.pulau === "Jawa" ? `<b>Penduduk:</b> ${pendudukJawa.total_penduduk} Orang<br><div id='jawa_chartdiv' style='width: 100%; height: 200px;'></div>` : "Tidak ada informasi penduduk"}
        `;
        const pulauMarker = L.marker([pulau.lat, pulau.lng])
          .bindPopup(popupContent)
          .on('mouseover', function () {
            this.openPopup();
            if (pulau.pulau === "Jawa") {
              DonutChartJawa();
            }
          })
          .on('click', function () {
            map!.setView([pulau.lat, pulau.lng], 7);
            showProvinsi(pulau.provinsi);
          });

        pulauLayer.addLayer(pulauMarker);
      });
      pulauLayer.addTo(map!);
    }

    function showProvinsi(provinsiData: any) {
      kabupatenLayer.clearLayers();
      kecamatanLayer.clearLayers();
      console.log("Showing provinsi markers");
      provinsiData.forEach((provinsi: any) => {
        console.log(`Adding marker for provinsi: ${provinsi.name}, Lat: ${provinsi.lat}, Lng: ${provinsi.lng}`);
        const popupContent = `
          <b>Nama Provinsi:</b> ${provinsi.name}<br>
          <b>Latitude:</b> ${provinsi.lat}<br>
          <b>Longitude:</b> ${provinsi.lng}<br>
          <b>Luas Wilayah:</b> ${provinsi.luas}<br>
          ${provinsi.name === "Jawa Barat" ? `<b>Penduduk:</b> ${pendudukJawabarat.total_penduduk} Orang<br><div id='chartdiv' style='width: 100%; height: 200px;'></div>` : ""}
          ${provinsi.name === "DI Yogyakarta" ? `<b>Penduduk:</b> ${pendudukDIY.total_penduduk} Orang<br><div id='diy_chartdiv' style='width: 100%; height: 200px;'></div>` : ""}
          ${provinsi.name === "Jawa Timur" ? `<b>Penduduk:</b> ${pendudukJawatimur.total_penduduk} Orang<br><div id='jawatimur_chartdiv' style='width: 100%; height: 200px;'></div>` : ""}
          ${provinsi.name === "Jawa Tengah" ? `<b>Penduduk:</b> ${pendudukJawatengah.total_penduduk} Orang<br><div id='jawatengah_chartdiv' style='width: 100%; height: 200px;'></div>` : ""}
          ${provinsi.name === "DKI Jakarta" ? `<b>Penduduk:</b> ${pendudukDkijakarta.total_penduduk} Orang<br><div id='dkijakarta_chartdiv' style='width: 100%; height: 200px;'></div>` : ""}
          ${provinsi.name === "Banten" ? `<b>Penduduk:</b> ${pendudukBanten.total_penduduk} Orang<br><div id='banten_chartdiv' style='width: 100%; height: 200px;'></div>` : ""}
        `;
        const provinsiMarker = L.marker([provinsi.lat, provinsi.lng])
          .bindPopup(popupContent)
          .on('mouseover', function () {
            this.openPopup();
            if (provinsi.name === "Jawa Barat") {
              renderDonutChart();
            } else if (provinsi.name === "DI Yogyakarta") {
              DonutChartDiy();
            } else if (provinsi.name === "Jawa Timur") {
              DonutChartJawatimur();
            } else if (provinsi.name === "Jawa Tengah") {
              DonutChartJawatengah();
            } else if (provinsi.name === "DKI Jakarta") {
              DonutChartDkijakarta();
            } else if (provinsi.name === "Banten") {
              DonutChartBanten();
            }
          })
          .on('click', function () {
            map!.setView([provinsi.lat, provinsi.lng], 9);
            showKabupaten(provinsi);
          });

        provinsiLayer.addLayer(provinsiMarker);
      });
      provinsiLayer.addTo(map!);
    }

    function showKabupaten(provinsi: any) {
      kecamatanLayer.clearLayers();
      provinsi.kabupaten.forEach((kabupaten: any) => {
        const popupContent = `
          <b>Nama Kabupaten:</b> ${kabupaten.name}<br>
          <b>Latitude:</b> ${kabupaten.lat}<br>
          <b>Longitude:</b> ${kabupaten.lng}<br>
          <b>Luas Wilayah:</b> ${kabupaten.luas}<br>
          Tidak ada informasi penduduk
        `;
        const kabupatenMarker = L.marker([kabupaten.lat, kabupaten.lng])
          .bindPopup(popupContent)
          .on('mouseover', function () {
            this.openPopup();
          })
          .on('click', function () {
            map!.setView([kabupaten.lat, kabupaten.lng], 14);
            showKecamatan(kabupaten.kecamatan);
          });

        kabupatenLayer.addLayer(kabupatenMarker);
      });
      kabupatenLayer.addTo(map!);
    }

    function showKecamatan(kecamatanData: any) {
      kecamatanData.forEach((kecamatan: any) => {
        const popupContent = `
          <b>Nama Kecamatan:</b> ${kecamatan.name}<br>
          <b>Latitude:</b> ${kecamatan.lat}<br>
          <b>Longitude:</b> ${kecamatan.lng}<br>
          <b>Luas Wilayah:</b> ${kecamatan.luas}<br>
          Tidak ada informasi penduduk
        `;
        const kecamatanMarker = L.marker([kecamatan.lat, kecamatan.lng])
          .bindPopup(popupContent)
          .on('mouseover', function () {
            this.openPopup();
          });

        kecamatanLayer.addLayer(kecamatanMarker);
      });
      kecamatanLayer.addTo(map!);
    }

    function DonutChartJawa() {
      if (!jawaData) return;

      let root = am5.Root.new("jawa_chartdiv");

      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      root._logo.dispose();

      let chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      }));

      let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "count",
        categoryField: "gender",
        alignLabels: false
      }));

      series.labels.template.setAll({
        forceHidden: true
      });

      series.data.setAll(jawaData);

      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      }));

      legend.data.setAll(series.dataItems);

      series.appear(1000, 100);
    }

    function renderDonutChart() {
      if (!jawaBaratData) return;

      let root = am5.Root.new("chartdiv");

      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      root._logo.dispose();

      let chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      }));

      let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "count",
        categoryField: "gender",
        alignLabels: false
      }));

      series.labels.template.setAll({
        forceHidden: true
      });

      series.data.setAll(jawaBaratData);

      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      }));

      legend.data.setAll(series.dataItems);

      series.appear(1000, 100);
    }

    function DonutChartDiy() {
      if (!diyData) return;

      let root = am5.Root.new("diy_chartdiv");

      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      root._logo.dispose();

      let chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      }));

      let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "count",
        categoryField: "gender",
        alignLabels: false
      }));

      series.labels.template.setAll({
        forceHidden: true
      });

      series.data.setAll(diyData);

      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      }));

      legend.data.setAll(series.dataItems);

      series.appear(1000, 100);
    }

    function DonutChartJawatimur() {
      if (!jawatimurData) return;

      let root = am5.Root.new("jawatimur_chartdiv");

      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      root._logo.dispose();

      let chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      }));

      let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "count",
        categoryField: "gender",
        alignLabels: false
      }));

      series.labels.template.setAll({
        forceHidden: true
      });

      series.data.setAll(jawatimurData);

      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      }));

      legend.data.setAll(series.dataItems);

      series.appear(1000, 100);
    }

    function DonutChartJawatengah() {
      if (!jawatengahData) return;

      let root = am5.Root.new("jawatengah_chartdiv");

      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      root._logo.dispose();

      let chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      }));

      let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "count",
        categoryField: "gender",
        alignLabels: false
      }));

      series.labels.template.setAll({
        forceHidden: true
      });

      series.data.setAll(jawatengahData);

      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      }));

      legend.data.setAll(series.dataItems);

      series.appear(1000, 100);
    }

    function DonutChartDkijakarta() {
      if (!dkijakartaData) return;

      let root = am5.Root.new("dkijakarta_chartdiv");

      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      root._logo.dispose();

      let chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      }));

      let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "count",
        categoryField: "gender",
        alignLabels: false
      }));

      series.labels.template.setAll({
        forceHidden: true
      });

      series.data.setAll(dkijakartaData);

      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      }));

      legend.data.setAll(series.dataItems);

      series.appear(1000, 100);
    }

    function DonutChartBanten() {
      if (!bantenData) return;

      let root = am5.Root.new("banten_chartdiv");

      root.setThemes([
        am5themes_Animated.new(root)
      ]);

      root._logo.dispose();

      let chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      }));

      let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "count",
        categoryField: "gender",
        alignLabels: false
      }));

      series.labels.template.setAll({
        forceHidden: true
      });

      series.data.setAll(bantenData);

      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      }));

      legend.data.setAll(series.dataItems);

      series.appear(1000, 100);
    }

    function updateMarkersByZoom() {
      const zoomLevel = map!.getZoom();
      console.log("Current zoom level:", zoomLevel);

      if (zoomLevel <= 6) {
        pulauLayer.clearLayers();
        provinsiLayer.clearLayers();
        kabupatenLayer.clearLayers();
        kecamatanLayer.clearLayers();
        addPulauMarkers();
      } else if (zoomLevel > 6 && zoomLevel <= 8) {
        pulauLayer.clearLayers();
        kabupatenLayer.clearLayers();
        kecamatanLayer.clearLayers();
        const visibleProvinsi = markersData.flatMap(pulau => pulau.provinsi);
        showProvinsi(visibleProvinsi);
      } else if (zoomLevel > 8 && zoomLevel <= 13) {
        pulauLayer.clearLayers();
        provinsiLayer.clearLayers();
        kecamatanLayer.clearLayers();
        const visibleProvinsi = markersData.flatMap(pulau => pulau.provinsi);
        visibleProvinsi.forEach(provinsi => showKabupaten(provinsi));
      } else if (zoomLevel > 13) {
        pulauLayer.clearLayers();
        provinsiLayer.clearLayers();
        kabupatenLayer.clearLayers();
        if (markersData.length > 0 && markersData[0].provinsi.length > 0 && markersData[0].provinsi[0].kabupaten.length > 0) {
          showKecamatan(markersData[0].provinsi[0].kabupaten[0].kecamatan);
        }
      }
    }

    map!.on('zoomend', updateMarkersByZoom);

    addPulauMarkers();

    onCleanup(() => {
      map!.off('zoomend', updateMarkersByZoom);
    });
  });

  return (
    <div class={styles.mapContainer}>
      <div ref={mapContainer} class={styles.map}></div>
      <div class={styles.searchContainer}>
        <input
          ref={searchInput}
          type="text"
          placeholder="Cari Pulau, Provinsi, Kabupaten, atau Kecamatan"
          value={searchTerm()}
          onInput={handleSearchInput}
          class={styles.searchBox}
        />
        {filteredLocations().length > 0 && (
          <div ref={searchResults} class={styles.searchResults}>
            {filteredLocations().map((location) => (
              <div
                class={styles.searchResultItem}
                onClick={() => zoomToLocation(location.lat, location.lng, location.type)}
              >
                {location.name} - {location.type}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PetaLokasi;