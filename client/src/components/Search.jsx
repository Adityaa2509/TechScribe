import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import { useSelector } from 'react-redux';

function Search() {
  const { user } = useSelector((state) => state.User);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        sort: sortFromUrl || 'desc',
        category: categoryFromUrl || 'uncategorized',
      });
    }
  
    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/v1/post/all?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      let result = data.posts;

      let isAdmin = false;
      let subscription = 'none';
      if (user) {
        isAdmin = user.isAdmin;
        subscription = user.subscriptionPlan.plan;
      }
      
      if (!isAdmin && (subscription === 'Basic' || subscription === 'none')) {
        result = result.filter(post => post.isPublic);
      }
      
      setPosts(result);
      setLoading(false);
      setShowMore(result.length === 9);
    };

    fetchPosts();
  }, [location.search, user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebarData);
    navigate(`/search?${urlParams.toString()}`);
  };
  
  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', numberOfPosts);
    const searchQuery = urlParams.toString();

    const res = await fetch(`/api/v1/post/all?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    let result = data.posts;

    let isAdmin = false;
    let subscription = 'none';
    if (user) {
      isAdmin = user.isAdmin;
      subscription = user.subscriptionPlan.plan;
    }

    if (!isAdmin && (subscription === 'Basic' || subscription === 'none')) {
      result = result.filter(post => post.isPublic);
    }

    setPosts(prevPosts => [...prevPosts, ...result]);
    setShowMore(data.posts.length === 9);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-10' onSubmit={handleSubmit}>
          <div className='flex justify-between flex-col gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term</label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col justify-between gap-2'>
            <label className='font-semibold'>Sort</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest First</option>
              <option value='asc'>Oldest First</option>
            </Select>
          </div>
          <div className='flex flex-col justify-between gap-2'>
            <label className='font-semibold'>Category</label>
            <Select onChange={handleChange} value={sidebarData.category} id='category'>
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='javascript'>JavaScript</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='pinkToOrange'>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && posts.length === 0 && <p className='text-xl text-gray-500'>No posts found.</p>}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading && posts && posts.map(post => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
