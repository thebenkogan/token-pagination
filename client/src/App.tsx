import "./App.css";
import Table from "./Table";
import { useExtractions } from "./api";

function App() {
  const { data, isLoading, onPageChange, pageIndex } = useExtractions();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Extractions</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Table
          isLoading={isLoading}
          extractions={data}
          onPageChange={onPageChange ?? (() => {})}
          pageIndex={pageIndex}
        />
      </div>
      {isLoading && <div>Fetching next page...</div>}
    </div>
  );
}

export default App;
