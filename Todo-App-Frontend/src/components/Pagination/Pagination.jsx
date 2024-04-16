import { useState } from "react";

import styles from "./Pagination.module.css";

export function Pagination({startPage, currentPage, onChangePage, endPage}) {
  const pages = [];

  console.log(`startPage: ${startPage} currentPage: ${currentPage} endPage: ${endPage}`);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <a
        key={i}
        className={currentPage == (i) ? styles["active"] : ""}
        onClick={() => onChangePage(i)}
      >
        {i}
      </a>
    );
  }

  function handleNextPage() {
    if(currentPage <= endPage) {
      onChangePage(currentPage+1)
    }
  }

  function handlePreviousPage() {
    if(currentPage > 1) {
      onChangePage(currentPage-1)
    }
  }

  return (
    <div className={styles["pagination"]}>
      {pages}
    </div>
  );
}
