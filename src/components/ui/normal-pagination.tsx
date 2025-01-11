import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChangePage: (page: number) => void;
}

export function PaginationComponent({
  page,
  pageSize,
  total,
  onChangePage,
}: Readonly<PaginationProps>) {
  const totalPages = Math.ceil(total / pageSize);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        console.log('isActive', i === page);
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            href='#'
            onClick={(e) => {
              e.preventDefault();
              onChangePage(i);
            }}
            isActive={i === page}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onChangePage(page - 1);
            }}
          />
        </PaginationItem>

        {page > 3 && (
          <>
            <PaginationItem>
              <PaginationLink
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  onChangePage(1);
                }}
                isActive={page === 1}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {page > 4 && <PaginationEllipsis />}
          </>
        )}

        {renderPageNumbers()}

        {page < totalPages - 2 && (
          <>
            {page < totalPages - 3 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  onChangePage(totalPages);
                }}
                isActive={page === totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onChangePage(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
