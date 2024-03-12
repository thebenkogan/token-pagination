import { Column, usePagination, useSortBy, useTable } from "react-table";
import { Extraction } from "./api";
import { useEffect, useMemo } from "react";

interface TableProps {
  extractions: Extraction[];
  onPageChange: (pageIndex: number) => void;
  pageIndex: number;
  isLoading: boolean;
}

function Table({
  extractions,
  onPageChange,
  pageIndex,
  isLoading,
}: TableProps) {
  const columns = useMemo<Column<Extraction>[]>(
    () => [
      { accessor: "id", Header: "ID" },
      { accessor: "name", Header: "Name" },
      {
        accessor: "created",
        Header: "Created Date",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      { accessor: "status", Header: "Status" },
    ],
    []
  );

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    page,
    canPreviousPage,
    gotoPage,
  } = useTable(
    {
      columns,
      data: extractions,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      },
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    gotoPage(pageIndex);
  }, [gotoPage, pageIndex]);

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      style={{ border: "solid black", padding: "5px" }}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ textAlign: "left" }}>
        <span style={{ marginRight: "10px" }}>
          Page number: {pageIndex + 1}
        </span>
        <button
          onClick={() => {
            // previousPage();
            onPageChange(pageIndex - 1);
          }}
          disabled={!canPreviousPage || isLoading}
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            // nextPage();
            onPageChange(pageIndex + 1);
          }}
          disabled={isLoading}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

export default Table;
