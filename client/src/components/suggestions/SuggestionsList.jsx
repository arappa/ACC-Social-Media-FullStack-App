import React, { useState, useEffect } from "react";
import { VStack, Box, StackDivider, Heading, Flex, Spacer, Button, Card, CardHeader, CardBody} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import "./SuggestionsList.css";

function SuggestionsList() {
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    useEffect(() => {
        const fetchSuggestedUsers = async (user) => {
            const requestOptions = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { user : user })
            }

            const res = await fetch("http://localhost:5050/users/suggestions", requestOptions);
            const users = await res.json()
            setSuggestedUsers(users);
        }
        const user = JSON.parse(localStorage.getItem("user"));
        fetchSuggestedUsers(user)
    }, [])


    return (
        <Card variant="outline">
            <CardHeader>
                <Heading>Who to follow</Heading>
            </CardHeader>
            <CardBody>
                <VStack
                    divider={<StackDivider borderColor='gray.200' />}
                    spacing={4}
                    align='stretch'
                >
                    {suggestedUsers.map((user) => (
                        <Flex key={user._id} minWidth='max-content' alignItems='center' gap='2'>
                            <Box p="2">
                                <Link className="user-link" to={`/profile/${user._id}`}>{user.username.length > 12 ? user.username.slice(0, 12) + '...' : user.username}</Link>
                            </Box>
                            <Spacer/>
                            <Button size="sm"><Link className="user-link" to={`/profile/${user._id}`}>View</Link></Button>
                        </Flex>
                    ))}
                </VStack>
            </CardBody>
        </Card>
    );
}

export default SuggestionsList