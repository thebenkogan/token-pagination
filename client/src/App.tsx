import "./App.css";
import Table from "./Table";
import { useExtractions } from "./api";

function App() {
  const { data, isLoading, onPageChange } = useExtractions();

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log(data);
  return (
    <div>
      <h1>Extractions</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Table extractions={data} onPageChange={onPageChange ?? (() => {})} />
      </div>
      {isLoading && <div>Fetching next page...</div>}
    </div>
  );
}

export default App;
