import { onMount } from "solid-js";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const ChartAktivitas = () => {
  onMount(() => {
    let root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0,
      })
    );

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("forceHidden", true);
    cursor.lineY.set("forceHidden", true);

    let date = new Date();
    date.setHours(0, 0, 0, 0);
    let value = 20;

    function generateData() {
      value = am5.math.round(Math.random() * 10 - 4.8 + value, 1);
      if (value < 0) value = Math.random() * 10;
      if (value > 120) value = 120 - Math.random() * 10; // Batas maksimal 120 menit
      am5.time.add(date, "day", 1);
      return { date: date.getTime(), value }; // 'value' dalam menit
    }

    function generateDatas(count) {
      const data = [];
      for (let i = 0; i < count; i++) data.push(generateData());
      return data;
    }

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true,
          minGridDistance: 90,
        }),
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Series",
        xAxis,
        yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, { labelText: "{valueY} menit" }),
      })
    );

    series.fills.template.setAll({ fillOpacity: 0.2, visible: true });

    chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

    let data = generateDatas(300);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => root.dispose();
  });

  return (
    <div>
      <h2>Total waktu kerja</h2>
      <div class="chart-container">
        <div id="chartdiv" style="width: 100%; height: 400px; max-width: 100%;"></div>
      </div>
    </div>
  );
};

export default ChartAktivitas;
