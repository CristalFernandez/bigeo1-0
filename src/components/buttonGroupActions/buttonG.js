import React, { useState, useEffect} from "react";
import { Modal, Button, Tabs, Tab, Form, Dropdown } from "react-bootstrap";
import axios from "axios";
import "./buttonG.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function ButtonG(props) {

  //states
  const [estado, setEstado] = useState('No Leído');
  const [formData, setFormData] = useState(null);

  const marcarLeido = () => {
    setEstado('Leído');
  };

  const marcarEnProceso = () => {
    setEstado('Asignado y en Proceso');
  };

  const marcarFinalizado = () => {
    setEstado('Finalizado');
  };

  //tabs
  const [activeTab, setActiveTab] = useState('datos');
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [textoInput, setTextoInput] = useState('');

  useEffect(() => {
    const url = 'http://localhost:3000/forms';
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

    const fetchData = async () => {
      try {
        const response = await axios.get(url, config); ///////falta apiiiii   ->    ahora noooo !!! jajajajjaja
        const data = response;
        console.log(data);
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTabSelect = (tabName) => {
    setActiveTab(tabName);
  };
  const handleOpcionSeleccionada = (opcion) => {
    setOpcionSeleccionada(opcion);
  };

  const handleTextoInputChange = (event) => {
    setTextoInput(event.target.value);
  };

  //modals
  const [showModal, setShowModal] = useState(false);
  // console.log(showModal);
  const [showModal2, setShowModal2] = useState(false);
  // console.log(showModal2);


  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    console.log(showModal);
  };

  const openModal2 = () => {
    setShowModal2(true);
  };

  const closeModal2 = () => {
    setShowModal2(false);
  };


  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [diasEntreFechas, setDiasEntreFechas] = useState(0);

  const handleFechaInicioChange = (date) => {
    setFechaInicio(date);
    calcularDiasEntreFechas(date, fechaFin);
  };

  const handleFechaFinChange = (date) => {
    setFechaFin(date);
    calcularDiasEntreFechas(fechaInicio, date);
  };

  const calcularDiasEntreFechas = (inicio, fin) => {
    if (inicio && fin) {
      const diferencia = Math.abs(fin - inicio);
      const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
      setDiasEntreFechas(dias);
    } else {
      setDiasEntreFechas(0);
    }
  };


  const handleGuardarAsignar = () => {
    // Aquí puedes realizar la lógica para guardar y asignar la tarea
    console.log("Guardar y asignar tarea:", opcionSeleccionada, textoInput);
    closeModal();



  };

  return (
    <div>
      <p className={`estado ${estado.toLowerCase()}`}>Estado: {estado}</p>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            marcarLeido();
            openModal();
          }}
          disabled={estado === 'Leído' | estado === 'Asignado y en Proceso'}
        >
          Ver
        </button>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => {
            marcarEnProceso();
            openModal2();
          }}
          disabled={estado === 'No Leído' | estado === 'Asignado y en Proceso' | estado === 'Finalizado'}
        >
          Asignar
        </button>
        <button
          type="button"
          className="btn btn-outline-danger "
          onClick={marcarFinalizado}
          disabled={estado != 'Asignado y en Proceso' | estado === 'Leído' | estado === 'No Leído'}
        >
          Completar
        </button>
      </div>


      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        size="lg">

        <Modal.Header closeButton>
          <Modal.Title>Formulario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            className="mb-3"
          >
            <Tab eventKey="datos" title="Datos">
              {formData && (
                <div>
                  <p>Id: {formData.form_id}</p>
                  <p>Tipo: {formData.type}</p>
                  <p>Usuario: {formData.userid}</p>
                  <p>Sector: {formData.propid}</p>
                  <p>Fecha: {formData.dateTime}</p>
                  <p>Estado: {formData.defect}</p>
                </div>
              )}
            </Tab>

            <Tab eventKey="ubicacion" title="Ubicación">
              {formData && (
                <div>
                  <p>Ubicación: {formData.propid}</p>
                </div>
              )}
            </Tab>

            <Tab eventKey="imagen" title="Imagen">
              {formData && (
                <div>
                  <img src={formData.image} alt="Imagen del formulario" />
                  <p>Nombre del formulario: {formData.type}</p>
                  <p>Estado: {formData.defect}</p>
                </div>
              )}
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal2} onHide={closeModal2} centered>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formOpcionesDesplegables">
              <Form.Label>Ejecutor</Form.Label>
              <Dropdown onSelect={handleOpcionSeleccionada}>
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  setTextoInput="Seleccione Fecha"
                >
                  {opcionSeleccionada ? opcionSeleccionada : "Seleccionar opción"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Opción 1">Opción 1</Dropdown.Item>
                  <Dropdown.Item eventKey="Opción 2">Opción 2</Dropdown.Item>
                  <Dropdown.Item eventKey="Opción 3">Opción 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Form.Label>Plazo</Form.Label>
              <DatePicker
                selected={fechaInicio}
                onChange={handleFechaInicioChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
              <DatePicker
                selected={fechaFin}
                onChange={handleFechaFinChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              /><Form.Label>Total de Días: {diasEntreFechas}</Form.Label>


              <Form.Label>Prioridad</Form.Label>
              <Dropdown onSelect={handleOpcionSeleccionada}>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {opcionSeleccionada ? opcionSeleccionada : "Seleccionar opción"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Opción Alta">Alta</Dropdown.Item>
                  <Dropdown.Item eventKey="Opción Media">Media</Dropdown.Item>
                  <Dropdown.Item eventKey="Opción Baja">Baja</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Form.Group controlId="formTextoInput">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escriba el texto aqui"
                value={textoInput}
                onChange={handleTextoInputChange}
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleGuardarAsignar}>
            Guardar y Asignar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
