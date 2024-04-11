import React, { useState } from "react";
import "./Navbar.css"
import { Button, Flex, HStack,Heading, Text} from "@chakra-ui/react";
import { useNavigate,  Link} from "react-router-dom";

function NavColumn({user}) {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.clear();
    navigate("/register");
  }

  return(
        <div className="sidebar">
          <Flex flexDirection="column">
            <HStack flexDirection="column" spacing='24px' alignItems="start">
              <div className="nav-link"><Heading><Link to="/">Home</Link></Heading></div>
              <div className="nav-link"><Text fontSize='3xl'><Link to={`/profile/${user?._id}`}>Profile</Link></Text></div>
              <div className="nav-link"><Text fontSize='3xl'><Link>Explore</Link></Text></div>
              <div className="nav-link"><Text fontSize='3xl'><Link>Messages</Link></Text></div>
              <div className="nav-link"><Text fontSize='3xl'><Link>Settings</Link></Text></div>
              <div className="nav-link-btn"><Text fontSize='3xl'><Button size='lg' variant="link" onClick={handleClick}>Log Out</Button></Text></div>
            </HStack>
          </Flex>
            
            
        </div>
    
  );
};

export default NavColumn;
