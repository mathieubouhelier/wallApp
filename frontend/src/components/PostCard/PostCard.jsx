import React from 'react';
import { useHistory } from 'react-router-dom';


const PostCard = ({visible, post, handleClickDeletePost}) => {
  const history = useHistory();


return(

  <><h2>{post.title}</h2><h3>{post.content} </h3>
          {visible && <div >
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
            }
export default PostCard;

