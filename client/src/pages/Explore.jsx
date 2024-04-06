import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import SnipCard from "../components/snipCard";

function Explore() {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://ezzerreur-hackbyte.onrender.com/codes/getallUserCode', {
          method: 'POST',
          headers: {
            'Authorization': `${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch snippets');
        }
        const data = await response.json();
        console.log('Received Data:');
        console.log(data);
        setSnippets(data.codes);
      } catch (error) {
        console.error('Error fetching snippets:', error);
      }
    };
    fetchSnippets();
  }, []);

  return (
    <div className="flex text-white bg-black">
      <Sidebar />
      <div className="w-full items-center flex flex-col h-screen">
        <div className="w-full p-1 my-12">
          <div className="w-full items-center justify-around flex">
            <h1 className="text-4xl"> See Top Snippets</h1>
            <button className="text-xl rounded-md bg-cyan-950 hover:bg-cyan-500 hover:text-black transition-all duration-100 hover:scale-[1.02] p-1">Add Snippet!</button>
          </div>
        </div>
        <div className="grid w-full px-3 grid-cols-3 justify-around gap-4">
          {snippets && snippets.length > 0 ? (
            snippets.map(post => (
              <SnipCard key={post._id} post={post} />
            ))
          ) : (
            <p>No snippets found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Explore;
