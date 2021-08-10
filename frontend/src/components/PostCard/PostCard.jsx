import React from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


const PostCard = ({ visible, post, handleClickDeletePost }) => {
  const history = useHistory();


  return (

    <Card  className="bg-dark text-white border Montez-font" >
      <Card.Body>
        <Card.Title className=" font" ><h2>{post.title}</h2></Card.Title>
        <Card.Text> <h4>
          {post.content}

        </h4>
        </Card.Text>
        {visible && <div >
          <Button className="m-3" variant="outline-light" onClick={() => history.push(`/publish`, { post })}>Edit this post</Button>
          <Button className="m-3"variant="outline-light" onClick={(e) => {
            handleClickDeletePost(e, post.id);
          }}>Delete this post</Button>
        </div>}

      </Card.Body>
    </Card>
  )
}
export default PostCard;

