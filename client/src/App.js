import React from "react";
import { Helmet } from "react-helmet";
import MainForm from "./components/form";
import { Container, Row, Col } from "reactstrap";

import './App.css';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Helmet>
        <style>{"body { background-color: #5EBD96; }"}</style>
      </Helmet>
      <Container>
        <Row>
          <Col>
            <MainForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
