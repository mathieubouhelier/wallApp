
import React, { useState, useEffect } from 'react';
import './publishPost.css';
import Container from 'react-bootstrap/Container';
import { useHistory } from 'react-router-dom';
import Input from "../../shared/components/Input";
import PublishManager from './PublishPostManager';



const PublishPost = (props) => {
  const postToEdit = props.location.state?.post;
  console.log("post", postToEdit);
  const history = useHistory();

  const [post, setPost] = useState({
    title: postToEdit ? postToEdit.title : '',
    content: postToEdit ? postToEdit.content : '',
  });
  const [errorMessagePost, setErrorMessagePost] = useState("");

  const [titleValid, setTitleValid] = useState(false);
  const [contentValid, setContentValid] = useState(false);

  async function handleClick(event) {
    event.preventDefault();
    const response = await PublishManager.publishPost(post);
    if (response.status === 201) {
      return setErrorMessagePost('Post published successfully');

    }

    setErrorMessagePost(response.data.message);

  }
  const handleClickBackToWall = (event) => {
    event.preventDefault();

    history.push('/wall')

  }


  useEffect(() => {
    setTitleValid(post.title?.length > 5)
    setContentValid(post.content?.length > 10)

  }, [post]);

  return (

    <>
      <h1> Welcome to publish page</h1>
      {postToEdit ? <h2>You can edit your post</h2> : <h2>You can write and publish your post</h2>}

      <Container>

        <div className="container">
          <div className="simple-login-container">
            <h2>Publish</h2>
            {errorMessagePost && <h2> {errorMessagePost}</h2>}
            <Input
              inputType="title"
              inputValid={titleValid || post.title === ""}
              value={post.title}
              onChange={(event) => setPost({ ...post, [event.target.name]: event.target.value })}
            />
            <Input
              inputType="content"
              inputValid={contentValid || post.content === ""}
            value={post.content}
              onChange={(event) => setPost({ ...post, [event.target.name]: event.target.value })}
            />
            <div className="col text-center">
              <div >
                <button
                  className="btn btn-block btn-login my-3 col-md-12 "
                  type="button"
                  data-testid="signin-btn"
                  disabled={!titleValid || !contentValid}
                  onClick={handleClick}
                >
                  Publish
                </button>
              </div>
              <div >
                <button
                  className="btn btn-block btn-login my-3 col-md-12 "
                  type="button"
                  data-testid="signin-btn"
                  onClick={handleClickBackToWall}
                >
                  Back to the Wall
                </button>
              </div>
            </div>
          </div>
        </div>

      </Container>

    </>
  )
}

export default PublishPost;
