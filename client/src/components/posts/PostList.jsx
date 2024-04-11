import PostCard from './PostCard';

function PostList({posts, onDelete }){

    return (
      <div>
        {posts.map((post, index) => (
          <div key={index} style={{paddingBottom: "1rem"}}>
            <PostCard key={post._id} post={post} onDelete={onDelete}></PostCard>
          </div>
        ))}
      </div>
    );
}

export default PostList;