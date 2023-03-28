import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dataFormatter, diff, maxValue, minValue } from "../../Helpers/WeightTrackerHelpers";
import { Weight, WeightTrackerProps } from "../../Interfaces/Weight";
import { getRecord } from "../../Repository";
import Loading from "../Loading";
import CreateWeightModal from "./CreateWeightModal";

function WeightTracker({showCreateWeightModal, setShowCreateWeightModal}: WeightTrackerProps) {
  const [data, setData] = useState<Weight[]>();
  const [loading, setLoading] = useState(true);

  const { getAccessTokenSilently } = useAuth0();

  const fetchData = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const data = await getRecord("http://167.179.146.115:5000/api/weight", token);

    setData(data);
    setLoading(false);
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {loading ? <Loading /> : <Row>
        <Col md={8} className="mt-4">
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Weight Tracker</Card.Title>

              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dataFormatter(data!)} margin={{top: 0, right: 24, bottom: 0, left: 24}}>
                  <defs>
                    <linearGradient id="weight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8be9fd" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#8be9fd" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient id="goal-weight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#bd93f9" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#bd93f9" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <Legend align="right" verticalAlign="top" iconType="circle" iconSize={8} />

                  <Tooltip
                    cursor={false}
                    contentStyle={{color: "#f8f8f2", borderColor: "#44475a", backgroundColor: "#282a36"}}
                    wrapperStyle={{outline: "none"}}
                  />

                  <XAxis dataKey="Date" axisLine={false} tick={{fill: "#44475a"}} tickLine={false} />
                  <YAxis domain={[minValue(data!), maxValue(data!)]} hide={true} />

                  <Area dataKey="Weight" stroke="#8be9fd" strokeWidth={2} fill="url(#weight)" fillOpacity={0.8} />
                  <Area dataKey="Goal Weight" stroke="#bd93f9" strokeWidth={2} fill="url(#goal-weight)" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mt-4">
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Weight Difference</Card.Title>

              <span className="weight-difference">{diff(data!)} kg</span>
            </Card.Body>
          </Card>
        </Col>

        {showCreateWeightModal && <CreateWeightModal weights={data!} show={showCreateWeightModal} setShow={setShowCreateWeightModal} reload={fetchData} />}
      </Row>}
    </>
  );
}

export default WeightTracker;
