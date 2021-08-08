import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import WallManager from './WallManager';


const Wall = () => {
  const history = useHistory();
  const [isFetching, setIsFetching] = useState(true);
  const [posts, setPosts] = useState([]);


  useEffect( () => {
    async function fetchData() {
      // const token =  await localStorage.getItem("WallAppToken")
      const response = await WallManager.loadAllPosts();
      console.log(response);
      setPosts([...response.data])
      setIsFetching(false)
    }
    fetchData();
   WallManager.loadAllPosts()
  }, []);

  return (


    <div className="container">
<h1>Welcome to the Wall</h1>
{!isFetching && posts.map((post) => {
  return <h3>{post.content}</h3>
})}
    </div>

  )

}

export default Wall;
