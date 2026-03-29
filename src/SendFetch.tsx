import { useState, useEffect } from "react";

interface RateRow {
  currency: string;
  code: string;
  mid?: number;
  bid?: number;
  ask?: number;
}
interface TableData {
  effectiveDate: string;
  rates: RateRow[];
}
interface SendFetchProps {
  table: string;
  search?: boolean;
  searchText?: string;
  code?: string;
  date?: string;
}

export default function SendFetch(props: SendFetchProps) {
  const [state, setState] = useState<TableData>({} as TableData);
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | false>(false);

  useEffect(() => {
    fetch(`${API_URL}/tables/${props.table}/`)
      .then((response) => response.json())
      .then((res) => {
        setState(res[0]);
        setLoaded(true);
        setError(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoaded(true);
      });
  }, [props.table]);

  if (!isLoaded) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (props.search) {
    const opcje: React.ReactElement[] = [];
    state.rates.forEach((element) => {
      if (
        !element.currency.includes(props.searchText ?? "") &&
        !element.code.includes(props.searchText ?? "")
      )
        return;
      opcje.push(
        <option key={element.code} value={element.code}>
          {element.currency}
        </option>,
      );
    });
    return <>{opcje}</>;
  }

  return (
    <>
      <h1>Hi!</h1>
      <table border={1}>
        <caption>Kursy walut z dnia {state.effectiveDate}</caption>
        <thead>
          <tr>
            <th>Waluta</th>
            <th>Kod</th>
            <th>{props.table !== "C" ? "Średni kurs" : "Kupno"}</th>
            {props.table === "C" && <th>Sprzedaż</th>}
          </tr>
        </thead>
        <tbody>
          {state.rates.map((val) => (
            <tr
              className={val.code === props.code ? "selected" : undefined}
              key={val.code}
            >
              <td>{val.currency}</td>
              <td>{val.code}</td>
              <td>{props.table === "C" ? val.bid : val.mid}</td>
              {props.table === "C" && <td>{val.ask}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
