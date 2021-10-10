import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";

function Post(props) {
  let history = useHistory();
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    Axios.get(`https://fullstackpedro-api.herokuapp.com/posts/byId/${id}`).then(
      (res) => {
        console.log(res.data);
        setPostObject(res.data);
      }
    );

    Axios.get(`https://fullstackpedro-api.herokuapp.com/comments/${id}`).then(
      (response) => {
        setComments(response.data);
      }
    );
  }, []);

  const addComment = () => {
    Axios.post(
      "https://fullstackpedro-api.herokuapp.com/comments",
      {
        commentBody: newComment,
        PostId: id,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    ).then((response) => {
      if (response.data.error) {
        return console.log(response.data.error);
      }

      const commentToAdd = {
        commentBody: newComment,
        username: response.data.username,
      };
      setComments([...comments, commentToAdd]);
      setNewComment("");
    });
  };

  const deleteComment = (id) => {
    Axios.delete(`https://fullstackpedro-api.herokuapp.com/comments/${id}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then(() => {
      setComments(
        comments.filter((val) => {
          return val.id != id;
        })
      );
    });
  };

  const deletePost = (id) => {
    Axios.delete(`https://fullstackpedro-api.herokuapp.com/posts/${id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then(() => {
      history.push("/");
    });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title");
      Axios.put(
        "https://fullstackpedro-api.herokuapp.com/posts/title",
        { newTitle: newTitle, id: id },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      ).then(() => {});
      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Post Text");
      Axios.put(
        "https://fullstackpedro-api.herokuapp.com/posts/postText",
        { newText: newPostText, id: id },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      ).then(() => {});
      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          >
            {" "}
            {postObject.title}{" "}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("postText");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}{" "}
            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label>Username: {comment.username}</label>
                {authState.username === comment.username && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
