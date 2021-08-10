
import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Input from "../../shared/components/Input";
import PublishManager from './PublishPostManager';
import Header from '../../components/Header/Header'

const PublishPost = (props) => {
  const history = useHistory();
  const postToEdit = props.dataWall.location.state?.post;

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
    if (response?.status === 201) {
      history.push({
        pathname: '/successfully',
        state: { message: "Post published  successfully", }
      });
    }
    setErrorMessagePost(response?.data.message);
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
      <Header />
      <Container fluid className="bg-dark text-white min-vh-100 text-center">
        <div class="row text-center chalk-font py-4">
          {postToEdit ? <h2>You can edit your post</h2> : <h2>You can write and publish your post</h2>}
        </div>
        {errorMessagePost && <h2> {errorMessagePost}</h2>}

        <Row className="justify-content-center px-2">
          <Button className="mt-3 col-md-2 bg-white m-2"
            variant="Light" disabled={!titleValid || !contentValid}
            onClick={handleClick}
          >Publish</Button>
          <Button className="mt-3 col-md-2 bg-white m-2"
            variant="Light"
            onClick={handleClickBackToWall}
          >Back to the Wall</Button>
        </Row>
        <Input
          inputType="title"
          inputValid={titleValid || post.title === ""}
          value={post.title}
          onChange={(event) => setPost({ ...post, [event.target.name]: event.target.value })}
        />
        <Container className="justify-content-center">
          <Row className=" mt-4">
            {(!contentValid || post.content === "") ?
              <small id="emailHelp" className="form-text text-danger">Your must have a least 10 characters</small> :
              <small>  </small>}
          </Row>
          <Row className=" mt-4">
            <textarea
              className="col"
              inputType="content"
              name="content"
              inputValid={contentValid || post.content === ""}
              value={post.content}
              placeholder="Write your post"
              onChange={(event) => setPost({ ...post, [event.target.name]: event.target.value })}
            />
          </Row>
        </Container>
      </Container>
    </>
  )
}

export default PublishPost;
