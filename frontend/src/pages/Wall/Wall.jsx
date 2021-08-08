import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import WallManager from './WallManager';


const Wall = () => {
  const history = useHistory();
  const [isFetching, setIsFetching] = useState(true);
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    console.log("useeffect");
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
      console.log("response click delete",response);
      setIsFetching(true);
    }
    deletePost();
    

    console.log("handle", postId);
  }

  return (


    <div className="container">
      <h1>Welcome to the Wall</h1>
      {!isFetching && posts.map((post) => {
        return (<><h3>{post.content}</h3>
          <button
            onClick={() => history.push(`/publish`, { post })}
          >Edit this post</button>
          <button
            onClick={(e) => {
              handleClickDeletePost(e, post.id);
            }}
          >Delete this post</button>
        </>

        )
      })}
    </div>

  )

}

export default Wall;
