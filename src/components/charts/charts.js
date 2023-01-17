import * as echarts from "echarts/core";
import { LineChart, BarChart, PieChart, GraphChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  LineChart,
  BarChart,
  PieChart,
  GraphChart,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
]);

export default echarts;
