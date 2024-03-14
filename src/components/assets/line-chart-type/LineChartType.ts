import {
  Chart,
  LineController,
  registerables,
  _adapters,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import "../../../core/library/dayjs.lib";

class LineChartWithCursor extends LineController {
  draw() {
    super.draw();
    const chart = this.chart;
    const ctx = this.chart.ctx;
    ctx.save();

    (window as any).z = chart;
    if ((chart as any).tooltip?._active?.length) {
      const activePoint = (chart as any).tooltip._active[0];
      const x = activePoint.element.x as number;
      const y = activePoint.element.y as number;

      ctx.beginPath();
      ctx.strokeStyle = "#B1B5C4";
      ctx.lineWidth = 2;
      ctx.moveTo(x, -10);
      ctx.lineTo(x, this.chart.height);
      ctx.stroke();
      ctx.save();

      ctx.beginPath();
      ctx.fillStyle = "#7FBA7A";
      ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.save();
    }
    ctx.restore();
  }
}
(Tooltip.positioners as any).top = (elements: any) => {
  const x = elements[0].element.x as number;

  return {
    x,
    y: -120,
  };
};
LineChartWithCursor.id = "LineWithCursor";
Chart.register(...registerables);
// Chart.register(annotationPlugin);
Chart.register(LineChartWithCursor);

const FORMATS = {
  datetime: "MMM D, YYYY, h:mm:ss a",
  millisecond: "h:mm:ss.SSS a",
  second: "h:mm:ss a",
  minute: "h:mm a",
  hour: "hA",
  day: "MMM D",
  week: "ll",
  month: "MMM YYYY",
  quarter: "[Q]Q - YYYY",
  year: "YYYY",
};

_adapters._date.override({
  formats: () => FORMATS,
  parse: (value, format) => {
    const valueType = typeof value;

    if (value === null || valueType === "undefined") {
      return null;
    }

    let parsedValue = null;

    if (valueType === "string" && typeof format === "string") {
      parsedValue = dayjs(value, format);
    } else if (!(value instanceof dayjs)) {
      parsedValue = dayjs(value);
    }

    return parsedValue?.isValid() ? parsedValue.valueOf() : null;
  },
  format: (time, format) => dayjs(time).format(format),
  add: (time, amount, unit) =>
    dayjs(time)
      .add(amount, unit as any)
      .valueOf(),
  diff: (max, min, unit) => dayjs(max).diff(dayjs(min), unit),
  startOf: (time, unit, weekday) => {
    if (unit === "isoWeek") {
      return dayjs(time)
        .isoWeekday(weekday as number)
        .startOf("day")
        .valueOf();
    }

    return dayjs(time)
      .startOf(unit as any)
      .valueOf();
  },
  endOf: (time, unit) =>
    dayjs(time)
      .endOf(unit as any)
      .valueOf(),
});
