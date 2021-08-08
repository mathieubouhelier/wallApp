import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import WallManager from './WallManager';
import { deleteFromLocalStorage } from '../../services/localStorage';
import { checkUserAuthorization } from '../../services/auth';




const Wall = () => {
  const history = useHistory();
  const [isFetching, setIsFetching] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setIsAuthorized(checkUserAuthorization())
    async function fetchData() {
      const response = await WallManager.loadAllPosts();
      setPosts([...response.data])
      setIsFetching(false)
    }
    fetchData();
    WallManager.loadAllPosts()
  }, [isFetching]);

  function handleClickDeletePost(event, postId) {
    event.preventDefault();
    async function deletePost() {
      const response = await WallManager.deleteOnePost(postId);
      if (response.status === 204) {
        alert("Post successfully deleted")
      }
      setIsFetching(true);
    }
    deletePost();
  }

  function handleClickLogout(event) {
    event.preventDefault();
    deleteFromLocalStorage("WallAppToken");
    setIsFetching(true);
  }

  return (
    <div className="container">
      <h1>Welcome to the Wall</h1>
      <button
        onClick={handleClickLogout}
      >Logout</button>
      <button
        onClick={() => history.push(`/`)}
      >home</button>
      {isAuthorized.authorized && <button
        onClick={() => history.push(`/publish`)}
      >Write a new Post</button>}
      {!isFetching && posts.map((post) => {
        return (<><h2>{post.title}</h2><h3>{post.content} </h3>
          {isAuthorized.user.id === post.user.id && <div >
            <button
              onClick={() => history.push(`/publish`, { post })}
            >Edit this post</button>
            <button
              onClick={(e) => {
                handleClickDeletePost(e, post.id);
              }}
            >Delete this post</button>
          </div>}
        </>
        )
      })}
    </div>

  )

}

export default Wall;
