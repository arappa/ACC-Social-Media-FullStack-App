import React, { useState } from "react";
import { Card, CardHeader, CardFooter, Heading, CardBody, FormControl, FormLabel, Input, FormHelperText, Text, Button } from '@chakra-ui/react';
import "./login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password, profilePicture: "abc.com", followers: [], following: [] })
        };
        const res = await fetch("http://localhost:5050/users/", requestOptions);
        if (!res.ok) {
            const errorMessage = await res.json();
            setErrorMessage(errorMessage.message);
        } else {
            const user = await res.json();
            localStorage.setItem("user", JSON.stringify(user));
            setUsername("");
            setPassword("");
            navigate("/")
        }
    }

    return (
        <div className="center">
            <Card>
                <CardHeader>
                    <Heading>
                        Register As A New User
                    </Heading>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                            {errorMessage && (
                                <Text color="red">{errorMessage}</Text>
                            )}
                            {!errorMessage && (
                                <FormHelperText>
                                    Enter your username
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            {!errorMessage && (
                                <FormHelperText>
                                    Enter Your Password
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            type='submit'
                        >
                            Register
                        </Button>
                    </form>
                </CardBody>
                <CardFooter>
                    <Link to="/login">Already Have An Account?</Link>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Register;
