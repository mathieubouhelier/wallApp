import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import WallManager from './WallManager';
import { loadFromLocalStorage, deleteFromLocalStorage } from '../../services/localStorage';
import jwtDecode from 'jwt-decode';




const Wall = () => {
  const history = useHistory();
  const [isFetching, setIsFetching] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [posts, setPosts] = useState([]);

  const checkUserAuthorization = () => {
    const token = loadFromLocalStorage('WallAppToken')

    if (token != null) {
      const decoded = jwtDecode(token);
      console.log("token decoded:", decoded);
      const now = Date.now().valueOf() / 1000;
      if (typeof decoded.exp !== 'undefined' && decoded.exp > now) {
        console.log("decoded", decoded);
        const user = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
        };
        return { authorized: true, user };
      }
    }
    return { authorized: false, user: "" };

  }

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
        console.log("isAuthorized.user.id", isAuthorized.user.id);
        console.log("post.id ", post.user.id);
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
