import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.css";
import { ButtonG } from "../buttonGroupActions/buttonG";
import ButtonFilter from "../buttonFilter/buttonFilter";
import fondo from "../../assets/img/fondoPalta.jpg";
import Navbar from "../navbar/navbar";
import "./home.css";
import Footer from "../footer/footer";
import { useTable, useSortBy } from "react-table";

function HomeViewAdmin(props) {
  const [currentPage, setCurrentPage] = useState(0);
  const elementsPerPage = 15;

  const handleClick = () => {
    console.log("click");
  };
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const [tableData, setTableData] = useState([]);

  const TableComponent = () => {

    const columns = React.useMemo(
      () => [
        {
          Header: "ID Formulario",
          accessor: "form_id",
          selector: row => row.form_id
        },
        {
          Header: "Tipo",
          accessor: "type",
          selector: row => row.type
        },
        {
          Header: "Encargado",
          accessor: "properties.userId",
          selector: row => row.userId

        },
        {
          Header: "Sector",
          accessor: "properties.formSprinkler.defect",
          selector: row => row.propid
        },
        {
          Header: "Fecha",
          accessor: "properties.dateTime",
          selector: row => row.dateTime
        },
        {
          Header: 'Acciones',
          accessor: 'acciones',
          className: 'text-center',
          disableSortBy: true, // Deshabilita la opción de ordenar esta columna
          Cell: () => <ButtonG />,
        },
      ],
      []
    );

    // Define los datos de la tabla
    
    const startIndex = currentPage * elementsPerPage;
    const endIndex = startIndex + elementsPerPage;
    const displayedData = tableData.slice(startIndex, endIndex);
    


    useEffect(() => {
      // Lógica para obtener los formularios de la API y actualizar el estado
      fetch('https://github.com/omGuerraAlfaro/bigeo-api.git')
        .then(response => response.json())
        .then(data => setTableData(data))
        .catch(error => console.error(error));
    }, []);

    // Crea la instancia de la tabla utilizando useTable y useSortBy
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable(
      {
        columns,
        data: tableData,
        initialState: {
          sortBy: [
            {
              id: "form_id",
              desc: false,
            },
          ],
        },
      },
      useSortBy
    );


    return (
      <div>
        <h1 className="titulo">Listado de Formularios</h1>
        <div className="table-responsive">
          <div className="scroll">
            <table className="table table-striped table-responsive" {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (column.isSortedDesc ? " ↓" : " ↑") : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />

      <img src={fondo} className="fondo" alt="fondo"></img>
      <div className="container data-table">
        <div className="container d-flex g-3 justify-content-end">
          <div className="border rounded p-1">
            <h6 className="text-center">Filtrar por:</h6>
            <ButtonFilter
              clase="mx-1"
              nombre="Pendientes"
              color="danger"
              tamaño="sm"
              onClick={handleClick}
            />
            <ButtonFilter
              clase="mx-1"
              nombre="Listos"
              color="secondary"
              tamaño="sm"
              onClick={handleClick}
            />
            <ButtonFilter
              clase="mx-1"
              nombre="Todos"
              color="secondary"
              tamaño="sm"
              onClick={handleClick}
            />
          </div>
        </div>
        <TableComponent />

        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(tableData.length / elementsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>

      <Footer />
    </div>
  );
}

export default HomeViewAdmin;
