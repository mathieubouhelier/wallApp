import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import WallManager from './WallManager';


const Wall = () => {
  const history = useHistory();

  useEffect( () => {
    async function fetchData() {
      // const token =  await localStorage.getItem("WallAppToken")
      const response = await WallManager.loadAllPosts();
      console.log(response);
      
    }
    fetchData();
   WallManager.loadAllPosts()
  }, []);

  return (


    <div className="container">
<h1>Welcome to the Wall</h1>
    </div>

  )

}

export default Wall;
