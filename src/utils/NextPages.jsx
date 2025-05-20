import React, { useState } from 'react';
const NextPage = ({ itemData, itemsPerPage }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  
    const qtyItem = itemData.length;
    const pages = [];
    for (let i = 1; i <= Math.ceil(qtyItem / itemsPerPage); i++) {
      pages.push(i);
    }
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemData.slice(indexOfFirstItem, indexOfLastItem);
  
    const handlePageClick = (event) => {
      const selectedPage = Number(event.target.id);
      setCurrentPage(selectedPage);
      if (selectedPage > maxPageNumberLimit) {
        setMaxPageNumberLimit(maxPageNumberLimit + 5);
        setMinPageNumberLimit(minPageNumberLimit + 5);
      } else if (selectedPage <= minPageNumberLimit) {
        setMaxPageNumberLimit(maxPageNumberLimit - 5);
        setMinPageNumberLimit(minPageNumberLimit - 5);
      }
    };
  
    const handleNextbtn = () => {
      if (currentPage < pages.length) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        if (nextPage > maxPageNumberLimit) {
          setMaxPageNumberLimit(maxPageNumberLimit + 5);
          setMinPageNumberLimit(minPageNumberLimit + 5);
        }
      }
    };
  
    const handlePrevbtn = () => {
      if (currentPage > 1) {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        if (prevPage <= minPageNumberLimit) {
          setMaxPageNumberLimit(maxPageNumberLimit - 5);
          setMinPageNumberLimit(minPageNumberLimit - 5);
        }
      }
    };
  
    const renderPageNumbers = pages.map((number) => {
      if (number > minPageNumberLimit && number <= maxPageNumberLimit) {
        return (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <span
              role="button"
              id={number}
              onClick={handlePageClick}
              className="page-link border-blue"
            >
              {number}
            </span>
          </li>
        );
      }
      return null;
    });
  
    const paginationUI = (
      <div className="d-md-flex align-items-center">
        <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
          ສະແດງ {indexOfFirstItem + 1} ຫາ {Math.min(indexOfLastItem, qtyItem)} ຂອງ {qtyItem} ລາຍການ
        </div>
        <ul className="pagination mb-0 ms-auto justify-content-center">
          <li className={`page-item ${currentPage === pages[0] ? 'disabled' : ''}`}>
            <button onClick={handlePrevbtn} className="page-link border-blue">ກອນໜ້າ</button>
          </li>
          {minPageNumberLimit >= 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
          {renderPageNumbers}
          {pages.length > maxPageNumberLimit && <li className="page-item disabled"><span className="page-link">...</span></li>}
          <li className={`page-item ${currentPage === pages[pages.length - 1] ? 'disabled' : ''}`}>
            <button onClick={handleNextbtn} className="page-link border-blue">ໜ້າຕໍ່ໄປ</button>
          </li>
        </ul>
      </div>
    );
  
    return { currentItems, paginationUI };
  };
  
  export default NextPage;
  