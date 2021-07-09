import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

const ProfilePosts = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const response = await axios.get(`/profile/${username}/posts`, {
          cancelToken: ourRequest.token,
        });
        setIsLoading(false);
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPosts();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((post) => (
        <Post noAuthor post={post} key={post._id} />
      ))}
    </div>
  );
};

export default ProfilePosts;
