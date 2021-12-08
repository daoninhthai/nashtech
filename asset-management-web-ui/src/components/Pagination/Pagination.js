import './Pagination.css'

import React, {useEffect, useState} from 'react';

const Pagination = ({usersPerPage, totalUsers, paginate}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
        pageNumbers.push(i);
    }
    const [currentPage, setCurrentPage] = useState(1);
    return (

        <nav>
            <ul className='pagination'>
                {currentPage === 1 ? null :
                    <>
                        <li className={"page-item page-link px-0 text-danger"}
                            style={{width: "80px", textAlign: "center", cursor: "pointer"}}
                            onClick={() => {
                                if (currentPage > 1) {
                                    paginate(currentPage - 1)
                                    setCurrentPage(currentPage - 1)
                                }
                            }}
                        >

                            Previous
                        </li>
                    </>
                }
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <a onClick={() => {
                            setCurrentPage(number);
                            paginate(number)
                        }}
                           href="#!" className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
                {currentPage === Math.ceil(totalUsers/usersPerPage) || Math.ceil(totalUsers/usersPerPage) === 0 ? null :
                    <li className={"page-item page-link px-0 text-danger"}
                        style={{width: "80px", textAlign: "center", cursor: "pointer"}}
                        onClick={() => {
                            if (currentPage < Math.ceil(totalUsers/usersPerPage)) {
                                paginate(currentPage + 1)
                                setCurrentPage(currentPage + 1)
                            }
                        }}
                    >
                        Next
                    </li>
                }
            </ul>
        </nav>
    );
};

export default Pagination;