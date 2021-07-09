import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";

const ProfileFollowing = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const response = await axios.get(`/profile/${username}/following`, {
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
      {posts.map((following, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${following.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={following.avatar} alt="" />{" "}
            {following.username}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileFollowing;
