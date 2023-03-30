import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ExerciseTracker from "../Components/ExerciseTracker/ExerciseTracker";
import Sidebar from "../Components/Sidebar";
import WeightTracker from "../Components/WeightTracker/WeightTracker";

function Dashboard() {
  const [showCreateWeightModal, setShowCreateWeightModal] = useState(false);
  const [showCreateDayModal, setShowCreateDayModal] = useState(false);

  return (
    <Container fluid>
      <Row>
        <Col md="auto" className="mt-4">
          <Sidebar
            setShowCreateWeightModal={setShowCreateWeightModal}
            setShowCreateDayModal={setShowCreateDayModal}
          />
        </Col>

        <Col className="mb-4">
          <WeightTracker
            showCreateWeightModal={showCreateWeightModal}
            setShowCreateWeightModal={setShowCreateWeightModal}
          />

          <ExerciseTracker
            showCreateDayModal={showCreateDayModal}
            setShowCreateDayModal={setShowCreateDayModal}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
