import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Image, Avatar, Heading, Flex, Box, Button, Spacer} from "@chakra-ui/react";
import PostList from "../posts/PostList";

function ProfileCard({ user_id, initCurrUser }) {
    const [user, setUser] = useState(null);
    const [currUser, setCurrUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const deletePost = (postId) => {
        setPosts(posts.filter((post) => post._id !== postId));
    }

    useEffect(() => {
        const fetchUsersAndPosts = async () => {
            try {
                if (initCurrUser && user_id){
                    const currentUserResponse = await fetch(`http://localhost:5050/users/${initCurrUser._id}`);
                    const currentUserData = await currentUserResponse.json();
                    setCurrUser(currentUserData);
        
                    // Fetch the user whose profile is being displayed
                    const userResponse = await fetch(`http://localhost:5050/users/${user_id}`);
                    const userData = await userResponse.json();
                    setUser(userData);
        
                    // Check relationship between users
                    if (currentUserData && userData) {
                        setIsCurrentUser(currentUserData._id === userData._id);
                        setIsFollowing(currentUserData.following.includes(userData._id));
                    }
        
                    // Fetch posts of the displayed user
                    const postsResponse = await fetch(`http://localhost:5050/posts/byuser/${userData._id}`);
                    const postsData = await postsResponse.json();
                    setPosts(postsData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchUsersAndPosts();
    }, [initCurrUser, user_id]);
    

    const handleFollow = async () => {
        try {
            const response = await fetch("http://localhost:5050/users/follow", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    follower_id: currUser._id,
                    following_id: user._id
                })
            });
            if (response.ok) {
                setIsFollowing(true);
                const users = await response.json();
                setCurrUser(users.follower);
                setUser(users.followed);
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const handleUnfollow = async () => {
        try {
            const response = await fetch("http://localhost:5050/users/unfollow", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    unfollower_id: currUser._id,
                    unfollowing_id: user._id
                })
            });
            if (response.ok) {
                setIsFollowing(false);
                const users = await response.json();
                setCurrUser(users.unfollower);
                setUser(users.unfollowed);
            }
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="profile-content">
            <Card>
                <CardHeader>
                    <Avatar><Image src={user.profilePicture} /></Avatar>
                    <Heading>{user.username}</Heading>
                </CardHeader>
                <CardBody>
                    <Flex minWidth='max-content' alignItems='center' gap='2'>
                        <Box p='2'>
                            <Heading size="md">Followers: {user.followers.length}</Heading>
                        </Box>
                        <Box p='2'>
                            <Heading size="md">Following: {user.following.length}</Heading>
                        </Box>
                        <Spacer/>
                        {!isCurrentUser && (
                            <>
                                {isFollowing ? (
                                    <Button colorScheme='red' onClick={handleUnfollow}>Unfollow</Button>
                                ) : (
                                    <Button colorScheme='blue' onClick={handleFollow}>Follow</Button>
                                )}
                            </>
                        )}
                    </Flex>
                </CardBody>
            </Card>
            <div className="scrollable-column">
                <PostList posts={posts} onDelete={deletePost}></PostList>
            </div>
        </div>
    );
}

export default ProfileCard;
