import { useState, useEffect } from "react";
import Canvas from "./Canvas";

interface BaseRate {
  effectiveDate: string;
}

interface RateC extends BaseRate {
  ask: number;
  bid: number;
}
interface RateAB extends BaseRate {
  mid: number;
}
type Rate = RateC | RateAB;

interface GraffProps {
  table: string;
  code: string;
  startData: string;
  data: string;
}

export default function Graff(props: GraffProps) {
  const [state, setState] = useState<Rate[]>([]);
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | false>(false);
  const [currency, setCurrency] = useState<string>();

  useEffect(() => {
    fetch(
      `${API_URL}/rates/${props.table}/${props.code}/${props.startData}/${props.data}/`,
    )
      .then((response) => response.json())
      .then((res) => {
        setState(res.rates);
        setCurrency(res.currency);
        setLoaded(true);
        setError(false);
      })
      .catch((err: unknown) => {
        setLoaded(true);
        setError(err instanceof Error ? err.message : "Unknown error");
      });
  }, [props]);

  if (!isLoaded) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const WIDTH = 500;
  const HEIGHT = 370;
  const gradient = 0.9;
  const arr: number[] = [];
  let MAX = 0,
    MIN = Infinity,
    maxDay = "",
    minDay = "";

  if (props.table === "C") {
    maxDay = minDay = (state[0] as RateC).effectiveDate;
    for (let i = 0; i < state.length; i++) {
      const item = state[i] as RateC;
      const middle = (item.ask + item.bid) / 2;
      if (middle > MAX) {
        const maxItemLength = Math.max(
          item.ask.toString().length,
          item.bid.toString().length,
        );
        MAX = Number(middle.toFixed(maxItemLength - 2));
        maxDay = item.effectiveDate;
      }
      if (middle < MIN) {
        const maxItemLength = Math.max(
          item.ask.toString().length,
          item.bid.toString().length,
        );
        MIN = Number(middle.toFixed(maxItemLength - 2));
        minDay = item.effectiveDate;
      }
      arr[i] = middle;
    }
  } else {
    for (let i = 0; i < state.length; i++) {
      arr[i] = (state[i] as RateAB).mid;
    }
    MAX = Math.max(...arr);
    MIN = Math.min(...arr);
    let i = 0;
    while ((state[i] as RateAB).mid !== MAX) {
      i++;
    }
    maxDay = state[i].effectiveDate;
    i = 0;
    while ((state[i] as RateAB).mid !== MIN) {
      i++;
    }
    minDay = state[i].effectiveDate;
  }

  function draw(ctx: CanvasRenderingContext2D) {
    const deltaW = WIDTH / state.length;
    const gradH = HEIGHT / (MAX - MIN);
    const yMax = 20 + (MAX - MIN) * gradH * gradient;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "grey";
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT - yMax);
    ctx.lineTo(WIDTH, HEIGHT - yMax);
    ctx.moveTo(0, HEIGHT - 20);
    ctx.lineTo(WIDTH, HEIGHT - 20);
    ctx.stroke();

    ctx.lineWidth = 8;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    for (let i = 0; i < arr.length; i++) {
      const x = i * deltaW;
      const y = 20 + (arr[i] - MIN) * gradH * gradient;
      if (i === 0) {
        ctx.moveTo(x, HEIGHT - y);
      } else {
        ctx.lineTo(x, HEIGHT - y);
      }
    }
    ctx.stroke();
  }

  return (
    <Canvas width={WIDTH} height={HEIGHT} draw={draw}>
      <div className="canvas_header">
        <span>{currency}</span>
        {props.table === "C" && " (kurs średni)"}
      </div>
      <div className="max">
        <span>Max:</span> {MAX} (<span>{maxDay}</span>)
      </div>
      <div className="min">
        <span>Min:</span> {MIN} (<span>{minDay}</span>)
      </div>
    </Canvas>
  );
}
