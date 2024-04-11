import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Heading,
  Card,
  CardBody,
} from '@chakra-ui/react';

function PostForm({ addPost }) {
  const [caption, setcaption] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const handleCaptionChange = (e) => {
    setcaption(e.target.value);
  };

  const handleSubmit = async () => {
    if (caption.trim().length === 0) {
      setIsOpen(true);
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { caption: caption, 
          img: "https://picsum.photos/200/300", 
          user: {
            id: user._id,
            username: user.username
           }
        })
    }
    const res = await fetch("http://localhost:5050/posts", requestOptions);
    const post = await res.json();
    addPost(post);
    setcaption('');
  };

  return (
    <Card>
      <CardBody>  
      <FormControl isInvalid={isOpen}>
        <FormLabel><Heading>Post caption</Heading></FormLabel>
        <Textarea
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Write your post here..."
          size="lg"
        />
        <FormErrorMessage>Please enter some text before posting.</FormErrorMessage>
      </FormControl>
      <Button mt="4" colorScheme="blue" onClick={handleSubmit}>
        POST
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Empty Post
          </AlertDialogHeader>
          <AlertDialogBody>
            Please enter some text before posting.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </CardBody>

    </Card>
  );
}

export default PostForm;
