import Image from "next/image";

import {fetchUser} from './api/api'

import { useRouter } from 'next/router'

import React, { useEffect, useState } from "react";

import { signOut, useSession, getSession } from 'next-auth/react'
import Link from 'next/link'
import { Row, Col, Container, Card, CardBody,Spinner,Badge,Button,Modal,ModalBody,ModalFooter,ModalHeader  } from "reactstrap";


import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { useQuery, gql } from "@apollo/client";

import Moment from 'react-moment';

import CreateEvent from "../components/events/CreateEvent";
import axios from "axios";

import QRCode from "react-qr-code";

import profileImg from "../assets/images/profile.png"

const USER_QUERY = gql`
query ($where: UserWhereUniqueInput!) {
    user(where:$where) {
      id
      username
      firstName
      lastName
      email
      usn
      branch{
        name
        id
      }
      gender
      roles
      createdAt
      eventRegistrations{
        event{
          title
          id
          startDate
          endDate
        }
        createdAt
      }
    }
  }      
`;


const Profile = ({user}) => {
    // return

    const { data: session, status } = useSession()

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

 
    if (!user) {
        return (<div className="container">
        <div className="text-center mt-4">
            <h3 className="text-4xl font-bold mb-4">You are not logged in</h3>
            <Link href="login">
            <button className="btn btn-primary">Sign in</button>
            </Link>
        </div>
    </div>)
    }

    const { data, loading, error } = useQuery(USER_QUERY, {
        variables: {
            "where": {
              "id": user.id
            }
          },
      });


      

      if (status != "authenticated") {
        return (
            <div className="container">
                <div className="text-center mt-4">
                    <h3 className="text-4xl font-bold mb-4">You are not logged in</h3>
                    <Link href="login">
                    <button className="btn btn-primary">Sign in</button>
                    </Link>
                </div>
            </div>
        );
      }

    // if (!data) return null;


    
    if (loading)
    return (

        <section >
        <div class="container py-5">
         

            <div class="row">
            <div class="col-lg-4">
                <div class="card mb-4">
                <div class="card-body text-center">
                
                <Skeleton count={10}/>
                </div>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="card mb-4">
                <div class="card-body">
              

                <div class="row">
                <Skeleton count={10}/>

               
                </div>
                </div>
                </div>

                <div class="row">
                <div class="col-md-12">
                    <div class="card mb-4 mb-md-0">
                    <div class="card-body">
                        <Skeleton count={10}/>
                    </div>
                    </div>
                </div>
                
                
            
            </div>
        </div>
        </div>
        </div>
        </section>


   
    );

    if (error)
    return (
        <div className="flex h-screen w-full items-center justify-center bg-stone-900 text-white">
            Something went wrong!!
        </div>
    );


    
    return (
        <section >
            <div class="container py-5">
             

                <div class="row">
                <div class="col-lg-4">
                    <div class="card mb-4 shadow">
                    <div class="card-body text-center">
                    

<Image
                      class="rounded-circle img-fluid"
                    src={profileImg}
                    width={100}
                    height={100}
                  />

                        <h5 class="my-3">{data.user.firstName} {data.user.lastName}</h5>
                        <Badge color="info">
                        {data.user.branch.name}
</Badge>
                      
                           
                        <p class="text-muted mb-1">USN: {data.user.usn}</p>
                        <div class="d-flex justify-content-center mb-2">
                        
                        <button type="button" class="btn btn-info ml-2">Events</button>
                  
                        <button type="button" class="btn btn-outline-info ms-1 ml-2" onClick={() => signOut()}>Logout</button>
                        
                        </div>
                       
                    </div>
                    </div>
                    <div class="card mb-4 mb-lg-0 shadow">
                    <div class="card-body p-0">
                    <div className="row">
                        <div className="col-md-12 text-center pt-4 pb-4">
                        <QRCode
                        style={{ height: "auto", maxWidth: "50%", width: "100%" }}
                        size={200} value="hey" />
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="card mb-4 shadow">
                    <div class="card-body">
                  

                    <div class="row">
                        <div class="col-sm-3">
                            <p class="mb-0">ID</p>
                        </div>
                        <div class="col-sm-9">
                            <p class="text-muted mb-0">{data.user.id}</p>
                        </div>
                        </div>

                        <hr/>

                    <div class="row">
                        <div class="col-sm-3">
                            <p class="mb-0">Username</p>
                        </div>
                        <div class="col-sm-9">
                            <p class="text-muted mb-0">@{data.user.username}</p>
                        </div>
                        </div>

                        <hr/>


                        <div class="row">
                        <div class="col-sm-3">
                            <p class="mb-0">Full Name</p>
                        </div>
                        <div class="col-sm-9">
                            <p class="text-muted mb-0">{data.user.firstName} {data.user.lastName}</p>
                        </div>
                        </div>
                        <hr />
                        <div class="row">
                        <div class="col-sm-3">
                            <p class="mb-0">Email</p>
                        </div>
                        <div class="col-sm-9">
                            <p class="text-muted mb-0">{data.user.email}</p>
                        </div>
                        </div>
                       
                        <hr/>
                      
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-md-12">
                        <div class="card mb-4 mb-md-0 shadow">
                        <div class="card-body">
                            <div className="row">
                                <div className="col-md-8">
                                <h4 class="card-title mb-4">Registered Events</h4>
                            
                                </div>
                                <div className="col-md-4">
                                {
                             data.user.roles.includes("eventManager") ? 
                             <button type="button" class="btn-info ms-1 ml-2 p-2 mb-2"onClick={toggle}>
                             Create Event
                         </button>
                             : <></>
                        }
                       
                                </div>
                            </div>
                          
                        <table class="table">
                                <thead class="bg-info text-white">
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Event Name</th>
                                    <th scope="col">Start Date</th>
                                    <th scope="col">End Date</th>
                                    <th scope="col">Registered Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   {
                                        data.user.eventRegistrations.map((reg, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{reg.event.title}</td>
                                                    <td>
                                                    <Moment format="DD/MM/YYYY H:m a" >{reg.event.startDate}</Moment>
                                                    </td>
                                                    <td>
                                                    <Moment format="DD/MM/YYYY H:m a" >{reg.event.endDate}</Moment>
                                                    </td>
                                                    <td>
                                                    <Moment format="DD/MM/YYYY H:m a" >{reg.createdAt}</Moment>
                                                    </td>
                                                </tr>
                                            )})
                                   }
                                    
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                    
                    </div>
                </div>
                </div>
            </div>


            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Create Event</ModalHeader>
                <ModalBody>
                <CreateEvent user={data.user} />
                </ModalBody>
             
            </Modal>

            </section>
    );
}


export default Profile;


export async function getServerSideProps(ctx) {
    const session = await getSession(ctx)
    if (!session) {
      return {
        props: {}
      }
    }
    const { user } = session;
    return {
      props: { user },
    }
}