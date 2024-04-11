import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import NavColumn from "../common/NavColumn";
import { Grid, GridItem } from "@chakra-ui/react";
import ProfileCard from "./profileCard";


function ProfilePage() {
    const [user, setUser] = useState(null);
    const [currUser, setCurrUser] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:5050/users/${userId}`);
                const fetchedUser = await res.json();
                setUser(fetchedUser);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        setCurrUser(JSON.parse(localStorage.getItem('user')));
        fetchUser();
    }, [userId]);

    return (
        <div className="contentContainer">
            <Grid templateColumns='repeat(10, 1fr)' gap={5}>
                <GridItem colStart={2} colEnd={4}>
                    <NavColumn user={currUser}></NavColumn>
                </GridItem>
                <GridItem colStart={4} colEnd={10}>
                    <ProfileCard user_id={userId} initCurrUser={currUser}></ProfileCard>
                </GridItem>
            </Grid>
        </div>
    );
}

export default ProfilePage;
