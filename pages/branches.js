import Image from "next/image";

import { useQuery, gql } from "@apollo/client";


import { Row, Col, Container, Card, CardBody,Spinner, CardHeader,CardText,CardTitle,Button } from "reactstrap";


import Link from "next/dist/client/link";


const BRANCHES_QUERY = gql`
{
  branches{
    id
    name
    events{
      title
      startDate
      endDate
      venue
      id
    }
  }
}
`;


const Branch = () => {

    const { data, loading, error } = useQuery(BRANCHES_QUERY);

    if (loading) return (
        <Row className="justify-content-center">
        <Col md="7" className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        </Col>
      </Row>
  
    );
    if (error) return <pre>{error.message}</pre>


    return (
  
        <div className="spacer">
          <Container>
            <Row className="justify-content-center">
              <Col md="7" className="text-center">
                <h2 className="title">Branches in our college</h2>
                {/* <h6 className="subtitle">
                  student can participet in any event and join or book the events according to there shedule join soon as possible
                </h6> */}
              </Col>
            </Row>
  
            {data.branches.map((branch) => (
                branch.events.length > 0 ? (
  
                <Row className="justify-content-left">
                  <Col md="4" className="text-center">
                  
                        <Card
                       color="info"
                        className="my-2"
                        style={{
                            width: '18rem'
                        }}
                        >
                        <CardHeader className="text-white">
                        {branch.events.length}  Event(s)
                        </CardHeader>
                        <CardBody >
                            <CardTitle tag="h5" className="text-white">
                            {branch.name}
                            </CardTitle>
                            <Link href="/events">
                            <Button color="primary">
                           View Events
                            </Button>
                            </Link>
                        </CardBody>
                        </Card>
                  </Col>
                </Row>
  
                                
                ) : ""
              )
              
              )}
              
              
          </Container>
        </div>
   
    );
}


export default Branch;