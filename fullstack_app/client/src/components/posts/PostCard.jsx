import React from "react";
import {Card, CardHeader, CardBody, Image, CardFooter, Flex, Box, Heading, Text, IconButton, Button, Center} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Avatar } from "@chakra-ui/react"; 
import { DeleteIcon } from "@chakra-ui/icons";

function timeSince(timestamp) {
  const postDate = new Date(timestamp);
  const currentDate = new Date();
  const seconds = Math.floor((currentDate - postDate) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes ago`;
  }
  return "Just Now";
}


function PostCard({ post, onDelete }) {
  const currUser = JSON.parse(localStorage.getItem("user"));

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5050/posts/${post._id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onDelete(post._id);
      } else {
        console.error('Failed to delete post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };


  return (
    <Card variant="outline">
      <CardHeader>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar src={post.image} />
            <Box>
              <Heading size="md"><Link to={`/profile/${post.author.id}`}>{post.author.username}</Link></Heading>
              <Text>{timeSince(post.timestamp)}</Text>
            </Box>
          </Flex>
          {currUser?._id === post.author.id && (
            <IconButton
              variant="ghost"
              colorScheme="red"
              aria-label="Delete post"
              icon={<DeleteIcon />}
              onClick={handleDelete}
            />
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>
          --- {post.caption} ---
        </Text>
      </CardBody>
      <Center>
      <Image
          objectFit="cover"
          src={post.image}
          boxSize='md'
          fallbackSrc='https://picsum.photos/200/300'
          borderRadius='md'
        />
      </Center>
      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <Button flex="1" variant="ghost">
          Like
        </Button>
        <Button flex="1" variant="ghost">
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
