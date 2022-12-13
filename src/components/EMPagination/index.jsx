import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import useWindowDimensions from "../../hooks/useWindowDimensions";

import './style.scss';

const EMPagination = ({onClick, itemsPerPage, items, scrollRef}) => {
  const { width } = useWindowDimensions();
  
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));

  }, [itemOffset, itemsPerPage, items]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    
    if(scrollRef) window.scrollTo(0, scrollRef.current.offsetTop - 20);
  };

  useEffect(() => {
    onClick({
      currentItems: currentItems
    })
  },[currentItems]);

  return (
    <ReactPaginate
      nextLabel=">"
      onPageChange={handlePageClick}
      pageRangeDisplayed={1}
      marginPagesDisplayed={width > 400 ? 3: 1}
      pageCount={pageCount}
      previousLabel="<"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakLabel="..."
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination paginationEM"
      activeClassName="active"
      renderOnZeroPageCount={null}
    />
  )
}

export default EMPagination;