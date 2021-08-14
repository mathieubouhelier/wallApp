import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import WallManager from './WallManager';
import { checkUserAuthorization } from '../../services/auth';
import PostCard from '../../components/PostCard/PostCard';
import Header from '../../components/Header/Header'
import { Container, Button } from 'react-bootstrap';


const Wall = () => {
  const history = useHistory();
  const [isFetching, setIsFetching] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setIsAuthorized(checkUserAuthorization())
    async function fetchData() {
      const response = await WallManager.loadAllPosts();
      if (response?.status === 200) {
        setPosts([...response.data])
      }
    }
    setIsFetching(false)
    fetchData();
  }, [isFetching]);

  function handleClickDeletePost(event, postId) {
    event.preventDefault();
    async function deletePost() {
      const response = await WallManager.deleteOnePost(postId);
      setIsFetching(true);
      if (response?.status === 204) {
        alert("Post successfully deleted")
      }
    }
    deletePost();
  }

  return (
    <Container fluid className="bg-dark text-white min-vh-100 w-100">
      <Header />
      {isAuthorized.authorized &&

        <Button data-testid="btn-writePost" className="m-3 Montez-font" variant="outline-light"
          onClick={() => history.push(`/publish`)}>
          Write a new Post</Button>
      }
      {isFetching && <h2>Loading</h2>}
      <Container className="pb-5">
        {!isFetching && posts.map((post, index) => {
          const visible = isAuthorized.user.id === post.user.id;
          return (
            <Container className="pt-5" key={index}>
              <div class="card-group">
                <PostCard
                  index={index}
                  visible={visible}
                  post={post}
                  handleClickDeletePost={handleClickDeletePost}
                />
              </div>
            </Container>
          )
        })}
      </Container>
    </Container>
  )
}

export default Wall;
