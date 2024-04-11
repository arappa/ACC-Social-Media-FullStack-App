import React from "react";
import {useState} from "react";
import {FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, Button, Heading} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import "./login.css";
import { Link } from "react-router-dom";


function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isError = username === '';
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password})
        };
        try {
            const res = await fetch("http://localhost:5050/users/login", requestOptions);
            if (res.ok) {
                const user = await res.json();
                localStorage.setItem("user", JSON.stringify(user));
                setUsername("");
                setPassword("");
                navigate("/");
            } else {
                const errorMessage = await res.json();
                console.error("Login failed:", errorMessage.message);
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }

    return(
        <div className="center">
            <form onSubmit={handleSubmit}>
                <Heading>Log In</Heading>
                <FormControl isInvalid={isError}>
                    <FormLabel>Username</FormLabel>
                    <Input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                    {!isError ? (
                    <FormHelperText>
                        Enter your username
                    </FormHelperText>
                    ) : (
                    <FormErrorMessage>Username is Required.</FormErrorMessage>
                    )}
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {!isError ? (
                    <FormHelperText>
                        Enter Your Password
                    </FormHelperText>
                    ) : (
                    <FormErrorMessage>Password is Required</FormErrorMessage>
                    )}
                </FormControl>
                <Button
                    mt={4}
                    colorScheme='teal'
                    type='submit'
                >
                    Login
                </Button>
            </form>

            <Link to="/register">Don't have an account?</Link>

        </div>
    );
}

export default Login;