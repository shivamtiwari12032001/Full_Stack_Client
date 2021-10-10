import React from "react";
import { useEffect, useState } from "react";
import Axios from "axios";
import { useHistory, Link } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const Home = (props) => {
  const [listofPost, setListOfPost] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      Axios.get("https://fullstackpedro-api.herokuapp.com/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }).then((res) => {
        // console.log(res);
        if (res.data.listofPosts) {
          setListOfPost(res.data.listofPosts);
          setLikedPosts(
            res.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        }
      });
    }
  }, []);

  const likeAPost = (postId) => {
    Axios.post(
      "https://fullstackpedro-api.herokuapp.com/like",
      { PostId: postId },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then((response) => {
      // alert(response.data);
      setListOfPost(
        listofPost.map((post) => {
          if (post.id === postId) {
            if (response.data.liked) {
              return { ...post, Likes: [...post.Likes, 0] };
            } else {
              const likesArray = post.Likes;
              likesArray.pop();
              return { ...post, Likes: likesArray };
            }
          } else {
            return post;
          }
        })
      );

      if (likedPosts.includes(postId)) {
        setLikedPosts(
          likedPosts.filter((id) => {
            return id != postId;
          })
        );
      } else {
        setLikedPosts([...likedPosts, postId]);
      }
    });
  };
  return (
    <div>
      {listofPost.map((item) => {
        return (
          <div key={item.id} className="post">
            <div className="title">{item.title}</div>
            <div
              className="body"
              onClick={() => history.push(`/post/${item.id}`)}
            >
              {item.postText}
            </div>
            <div className="footer">
              <div className="username">
                <Link to={`/profile/${item.UserId}`}>{item.username}</Link>
              </div>
              <div className="buttons">
                <ThumbUpIcon
                  onClick={() => {
                    likeAPost(item.id);
                  }}
                  className={
                    likedPosts.includes(item.id) ? "unlikeBttn" : "likeBttn"
                  }
                />

                <label> {item.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
