"use client";

import { useEffect, useState } from "react";
import { FilterDrawer, Filters } from "./filter-drawer";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface EventItem {
  id: string;
  camera: string;
  time: string;
  face: string;
  eventType: string;
  details: string;
  confidence: string;
  alert: string;
}

export default function EventsTable() {
  // ===== STATE =====
  const [filters, setFilters] = useState<Filters>({});
  const [data, setData] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // giả lập
  const [loading, setLoading] = useState(false);

  // ===== API MOCK FUNCTION =====
  async function fetchEvents({
    page,
    filters,
  }: {
    page: number;
    filters: Filters;
  }) {
    setLoading(true);

    //-- GIẢ API
    await new Promise((r) => setTimeout(r, 400));

    const mockData: EventItem[] = Array.from({ length: 10 }).map(() => ({
      id: "EVT-001",
      camera: "Cam 01",
      time: "2025-11-05 14:21:30",
      face: "Face #14",
      eventType: "Face",
      details: "Known – Nguyễn Văn A",
      confidence: "97 %",
      alert: "Normal",
    }));

    setData(mockData);
    setLoading(false);
  }

  // ===== REFETCH WHEN page OR filters CHANGE =====
  useEffect(() => {
  const load = async () => {
    await fetchEvents({ page, filters });
  };

  load();
}, [page, filters]);


  // ===== HANDLE FILTER SUBMIT =====
  const handleFilterSubmit = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1); // reset về trang đầu khi lọc
  };

  return (
    <div className="w-full rounded-lg border bg-white p-4 mt-6 shadow-sm">
      {/* FILTER BUTTON */}
      <div className="flex justify-end mb-4">
        <FilterDrawer defaultFilters={filters} onSubmit={handleFilterSubmit} />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-6">Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event ID</TableHead>
              <TableHead>Camera</TableHead>
              <TableHead>Detected Time</TableHead>
              <TableHead>Face</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>Event Details</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Alert Level</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.camera}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.face}</TableCell>
                <TableCell>{row.eventType}</TableCell>
                <TableCell>{row.details}</TableCell>
                <TableCell>{row.confidence}</TableCell>
                <TableCell>{row.alert}</TableCell>
                <TableCell>
                  <Button variant="link" className="px-0">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>

            {[1, 2, 3].map((num) => (
              <PaginationItem key={num}>
                <PaginationLink
                  href="#"
                  isActive={num === page}
                  onClick={() => setPage(num)}
                >
                  {num}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => page < totalPages && setPage(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
