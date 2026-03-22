import { useState } from "react";
import SendFetch from "./SendFetch";
import Graff from "./Graff";
import "./waluty.scss";

export default function App() {
  const [table, setTable] = useState("C");
  const [symbol, setSymbol] = useState("");
  const [committedSymbol, setCommittedSymbol] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    switch (ev.target.id) {
      case "table":
        setTable(ev.target.value);
        setSymbol("");
        setCommittedSymbol("");
        setStartDate("");
        break;
      case "input": {
        setSymbol(ev.target.value);
        const isValid = /^[A-Z]{3}$/.test(ev.target.value);
        setCommittedSymbol(isValid ? ev.target.value : "");
        if (!isValid) setStartDate("");
        break;
      }
      case "data": {
        let delta: number;
        const today = new Date().getTime();
        switch (ev.target.value) {
          case "3days":
            delta = 3 * 24 * 3600 * 1000;
            break;
          case "week":
            delta = 7 * 24 * 3600 * 1000;
            break;
          case "month":
            delta = 30 * 24 * 3600 * 1000;
            break;
          case "3month":
            delta = 3 * 30 * 24 * 3600 * 1000;
            break;
          default:
            setStartDate("");
            return;
        }
        setStartDate(new Date(today - delta).toISOString().substring(0, 10));
        break;
      }
      default:
        throw Error("...");
    }
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit} name="main">
        <label htmlFor="table">Wybierz tabelę: </label>
        <select onChange={handleChange} value={table} id="table">
          <option value="A">Tabela A kursów średnich walut obcych</option>
          <option value="B">Tabela B kursów średnich walut obcych</option>
          <option value="C">
            Tabela C kursów kupna i sprzedaży walut obcych
          </option>
        </select>
        <br />
        <br />
        <label htmlFor="input">Wprowadź walutę: </label>
        <input
          value={symbol}
          list="waluta"
          onChange={handleChange}
          id="input"
          spellCheck={false}
        />
        <datalist id="waluta">
          <SendFetch searchText={symbol} table={table} search />
        </datalist>
        {committedSymbol && (
          <>
            <label htmlFor="data">Wybierz okres: </label>
            <select id="data" onChange={handleChange}>
              <option></option>
              <option value="3days">3 dni</option>
              <option value="week">tydzień</option>
              <option value="month">miesiąc</option>
              <option value="3month">3 miesiące</option>
            </select>
          </>
        )}
      </form>
      <div>{}</div>
      <SendFetch code={committedSymbol} table={table} date={startDate} />
      {startDate && (
        <Graff
          table={table}
          code={committedSymbol}
          startData={startDate}
          data={new Date().toISOString().substring(0, 10)}
        />
      )}
    </>
  );
}
