import { useSelector } from "react-redux"
import './search.css'
import { Link } from "react-router-dom"
const SearchList = () => {
    const {searchPosts} = useSelector((state) => state.post)
  return (
    <>
    <div className="search_list"> 
    <div>result(s)base on your search keyword:</div>
      <div className="list_item">
        { searchPosts.length > 0 ? 
        searchPosts.map(post => (
            <li key={post._id}><Link to={`/${post._id}`}>{post.postTitle}</Link></li>
        )) : ('Search not found!')}
    </div></div>

    </>
  )
}

export default SearchList